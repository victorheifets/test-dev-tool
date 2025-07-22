#!/bin/bash

# Bulletproof Frontend Deployment Script v2
# This script handles all edge cases and provides a reliable deployment

set -e  # Exit on error

# Configuration
STACK_NAME="test-dev-tool-frontend"
REGION="eu-west-1"
ENVIRONMENT="prod"
BUCKET_NAME="test-dev-tool-prod-764414385399"  # Existing bucket

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}📋 $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI not found. Please install it first."
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js not found. Please install it first."
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm not found. Please install it first."
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials not configured. Please run 'aws configure'."
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Build frontend
build_frontend() {
    log_info "Building frontend..."
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        log_info "Installing dependencies..."
        npm ci
    fi
    
    # Build for production
    export NODE_ENV=production
    export VITE_API_URL=https://lph40ds6v8.execute-api.eu-west-1.amazonaws.com/prod
    
    npm run build:prod
    
    if [ ! -d "dist" ]; then
        log_error "Build failed - dist directory not found"
        exit 1
    fi
    
    log_success "Frontend built successfully"
}

# Deploy to S3
deploy_to_s3() {
    log_info "Deploying to S3 bucket: $BUCKET_NAME"
    
    # Check if bucket exists
    if ! aws s3api head-bucket --bucket "$BUCKET_NAME" --region "$REGION" 2>/dev/null; then
        log_error "S3 bucket $BUCKET_NAME not found"
        exit 1
    fi
    
    # First: Upload HTML and JSON files with shorter cache (these must go first to avoid cache issues)
    aws s3 sync dist/ "s3://$BUCKET_NAME/" \
        --cache-control "public,max-age=300,no-cache" \
        --exclude "*" \
        --include "*.html" \
        --include "*.json" \
        --region "$REGION"
    
    # Second: Upload all other files with long cache headers and clean up old files
    aws s3 sync dist/ "s3://$BUCKET_NAME/" --delete \
        --cache-control "public,max-age=31536000,immutable" \
        --exclude "*.html" \
        --exclude "*.json" \
        --region "$REGION"
    
    log_success "Files deployed to S3"
}

# Get or create CloudFront distribution
handle_cloudfront() {
    log_info "Checking CloudFront distribution..."
    
    # Check if we already have a distribution for this bucket
    DISTRIBUTION_ID=$(aws cloudfront list-distributions --region "$REGION" \
        --query "DistributionList.Items[?Origins.Items[0].DomainName=='${BUCKET_NAME}.s3.${REGION}.amazonaws.com'].Id" \
        --output text 2>/dev/null || echo "")
    
    if [ -z "$DISTRIBUTION_ID" ] || [ "$DISTRIBUTION_ID" == "None" ]; then
        log_warning "No CloudFront distribution found. Creating new one..."
        
        # Create OAC first
        OAC_ID=$(aws cloudfront create-origin-access-control \
            --origin-access-control-config \
            Name="${STACK_NAME}-oac",SigningProtocol=sigv4,SigningBehavior=always,OriginAccessControlOriginType=s3 \
            --region "$REGION" \
            --query 'OriginAccessControl.Id' \
            --output text 2>/dev/null || echo "")
        
        if [ -z "$OAC_ID" ]; then
            # Try to find existing OAC
            OAC_ID=$(aws cloudfront list-origin-access-controls --region "$REGION" \
                --query "OriginAccessControlList.Items[?Name=='${STACK_NAME}-oac'].Id" \
                --output text 2>/dev/null || echo "")
        fi
        
        log_info "Using OAC: $OAC_ID"
        
        # Create distribution config
        cat > /tmp/cf-config.json <<EOF
{
  "CallerReference": "${STACK_NAME}-$(date +%s)",
  "Comment": "Test Dev Tool Frontend Distribution",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [{
      "Id": "S3-${BUCKET_NAME}",
      "DomainName": "${BUCKET_NAME}.s3.${REGION}.amazonaws.com",
      "S3OriginConfig": {"OriginAccessIdentity": ""},
      "OriginAccessControlId": "${OAC_ID}"
    }]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-${BUCKET_NAME}",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {"Enabled": false, "Quantity": 0},
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {"Forward": "none"}
    },
    "MinTTL": 0,
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"],
      "CachedMethods": {"Quantity": 2, "Items": ["GET", "HEAD"]}
    },
    "Compress": true
  },
  "CustomErrorResponses": {
    "Quantity": 2,
    "Items": [
      {"ErrorCode": 404, "ResponsePagePath": "/index.html", "ResponseCode": "200", "ErrorCachingMinTTL": 300},
      {"ErrorCode": 403, "ResponsePagePath": "/index.html", "ResponseCode": "200", "ErrorCachingMinTTL": 300}
    ]
  },
  "Enabled": true,
  "PriceClass": "PriceClass_100"
}
EOF
        
        # Create distribution
        DISTRIBUTION_ID=$(aws cloudfront create-distribution \
            --distribution-config file:///tmp/cf-config.json \
            --region "$REGION" \
            --query 'Distribution.Id' \
            --output text)
        
        log_success "Created CloudFront distribution: $DISTRIBUTION_ID"
        
        # Update bucket policy
        DISTRIBUTION_ARN="arn:aws:cloudfront::$(aws sts get-caller-identity --query Account --output text):distribution/${DISTRIBUTION_ID}"
        
        cat > /tmp/bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "AllowCloudFrontServicePrincipal",
    "Effect": "Allow",
    "Principal": {"Service": "cloudfront.amazonaws.com"},
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::${BUCKET_NAME}/*",
    "Condition": {
      "StringEquals": {"AWS:SourceArn": "${DISTRIBUTION_ARN}"}
    }
  }]
}
EOF
        
        aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy file:///tmp/bucket-policy.json --region "$REGION"
        log_success "Updated bucket policy"
    else
        log_success "Using existing CloudFront distribution: $DISTRIBUTION_ID"
    fi
    
    # Get domain name
    DOMAIN_NAME=$(aws cloudfront get-distribution --id "$DISTRIBUTION_ID" --region "$REGION" \
        --query 'Distribution.DomainName' --output text)
    
    echo "$DISTRIBUTION_ID" > .cloudfront-id
    echo "$DOMAIN_NAME" > .cloudfront-domain
}

# Invalidate CloudFront cache
invalidate_cache() {
    log_info "Creating CloudFront invalidation..."
    
    INVALIDATION_ID=$(aws cloudfront create-invalidation \
        --distribution-id "$DISTRIBUTION_ID" \
        --paths "/*" \
        --region "$REGION" \
        --query 'Invalidation.Id' \
        --output text)
    
    log_success "Created invalidation: $INVALIDATION_ID"
}

# Main deployment flow
main() {
    log_info "🚀 Starting bulletproof frontend deployment v2..."
    
    # Run all steps
    check_prerequisites
    build_frontend
    deploy_to_s3
    handle_cloudfront
    invalidate_cache
    
    # Summary
    echo ""
    log_success "🎉 Deployment completed successfully!"
    echo ""
    echo "📋 Deployment Summary:"
    echo "  - S3 Bucket: $BUCKET_NAME"
    echo "  - CloudFront ID: $DISTRIBUTION_ID"
    echo "  - Frontend URL: https://$DOMAIN_NAME"
    echo ""
    log_warning "Note: CloudFront may take 15-20 minutes to fully deploy"
    echo ""
    
    # Save deployment info
    cat > deployment-info.json <<EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "bucket": "$BUCKET_NAME",
  "distribution_id": "$DISTRIBUTION_ID",
  "domain": "$DOMAIN_NAME",
  "region": "$REGION",
  "environment": "$ENVIRONMENT"
}
EOF
    
    log_success "Deployment info saved to deployment-info.json"
}

# Run main function
main "$@"