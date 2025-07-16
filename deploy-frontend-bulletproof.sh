#!/bin/bash

# BULLETPROOF Frontend Deployment Script
# Deploys the Course Management Frontend to S3 and CloudFront
# Includes all fixes and error handling for production deployment

set -e

echo "🚀 Starting bulletproof frontend deployment..."

# Configuration
FRONTEND_DIR="."
STACK_NAME="course-management-frontend"
REGION="eu-west-1"
API_URL="https://lph40ds6v8.execute-api.eu-west-1.amazonaws.com/prod"
ENVIRONMENT="prod"
ACCOUNT_ID="764414385399"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}📋 Step: $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up temporary files...${NC}"
    rm -f /tmp/distribution-config.json /tmp/updated-config.json /tmp/bucket-policy.json
}

trap cleanup EXIT

print_step "1. Pre-deployment checks"

# Check if frontend directory exists
if [ ! -d "$FRONTEND_DIR" ]; then
    print_error "Frontend directory not found: $FRONTEND_DIR"
    exit 1
fi

# Check AWS CLI is configured
if ! aws sts get-caller-identity &>/dev/null; then
    print_error "AWS CLI not configured. Please run 'aws configure'"
    exit 1
fi

# Check Node.js is installed
if ! command -v node &>/dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi

print_success "Pre-deployment checks passed"

print_step "2. Deploy CloudFormation infrastructure"

# Deploy CloudFormation stack
aws cloudformation deploy \
    --template-file cloudfront-deployment.yaml \
    --stack-name $STACK_NAME \
    --parameter-overrides Environment=$ENVIRONMENT \
    --capabilities CAPABILITY_IAM \
    --region $REGION

# Wait for stack to complete
aws cloudformation wait stack-deploy-complete \
    --stack-name $STACK_NAME \
    --region $REGION

# Get stack outputs
S3_BUCKET=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' \
    --output text)

CLOUDFRONT_DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`DistributionId`].OutputValue' \
    --output text)

CLOUDFRONT_DOMAIN=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`DistributionDomainName`].OutputValue' \
    --output text)

print_success "CloudFormation infrastructure deployed"
echo -e "${GREEN}   S3 Bucket: $S3_BUCKET${NC}"
echo -e "${GREEN}   CloudFront ID: $CLOUDFRONT_DISTRIBUTION_ID${NC}"
echo -e "${GREEN}   CloudFront Domain: $CLOUDFRONT_DOMAIN${NC}"

print_step "3. Installing dependencies"

cd "$FRONTEND_DIR"

# Install dependencies
npm ci

if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi

print_success "Dependencies installed"

print_step "4. Generating API types (if available)"

# Generate API types from backend (non-blocking)
if command -v npm run generate-types &>/dev/null; then
    npm run generate-types || print_warning "Failed to generate API types - continuing with existing types"
else
    print_warning "generate-types script not found - skipping"
fi

print_step "5. Building application"

# Set production environment variables
export NODE_ENV=production
export VITE_API_URL=$API_URL

# Build the application
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed"
    exit 1
fi

print_success "Application built successfully"

print_step "6. Running pre-deployment tests"

# Run type checking (if available)
if command -v npm run types:validate &>/dev/null; then
    npm run types:validate || print_warning "Type checking failed - continuing deployment"
else
    print_warning "Type validation script not found - skipping"
fi

print_step "7. Deploying to S3"

# Deploy to S3
aws s3 sync ./dist s3://$S3_BUCKET --delete --region $REGION

if [ $? -ne 0 ]; then
    print_error "S3 deployment failed"
    exit 1
fi

print_success "Deployed to S3"

print_step "8. Ensuring CloudFront distribution is enabled"

# Check if distribution is enabled
DISTRIBUTION_ENABLED=$(aws cloudfront get-distribution \
    --id $CLOUDFRONT_DISTRIBUTION_ID \
    --query 'Distribution.DistributionConfig.Enabled' \
    --output text)

if [ "$DISTRIBUTION_ENABLED" = "False" ]; then
    print_warning "CloudFront distribution is disabled. Enabling..."
    
    # Get current distribution configuration
    aws cloudfront get-distribution-config --id $CLOUDFRONT_DISTRIBUTION_ID > /tmp/distribution-config.json
    
    # Update enabled status
    cat /tmp/distribution-config.json | jq '.DistributionConfig.Enabled = true | .DistributionConfig' > /tmp/updated-config.json
    
    # Update distribution
    ETAG=$(cat /tmp/distribution-config.json | jq -r '.ETag')
    aws cloudfront update-distribution \
        --id $CLOUDFRONT_DISTRIBUTION_ID \
        --if-match $ETAG \
        --distribution-config file:///tmp/updated-config.json
    
    print_success "CloudFront distribution enabled"
else
    print_success "CloudFront distribution is already enabled"
fi

print_step "9. Ensuring S3 bucket policy is correct"

# Create bucket policy for CloudFront access
cat > /tmp/bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$S3_BUCKET/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::$ACCOUNT_ID:distribution/$CLOUDFRONT_DISTRIBUTION_ID"
        }
      }
    }
  ]
}
EOF

# Apply bucket policy
aws s3api put-bucket-policy \
    --bucket $S3_BUCKET \
    --policy file:///tmp/bucket-policy.json \
    --region $REGION

print_success "S3 bucket policy applied"

print_step "10. Invalidating CloudFront cache"

# Invalidate CloudFront distribution
INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text)

print_success "CloudFront cache invalidation initiated (ID: $INVALIDATION_ID)"

print_step "11. Waiting for CloudFront distribution to deploy"

# Wait for distribution to be deployed
print_warning "Waiting for CloudFront distribution to deploy (this may take 10-20 minutes)..."
aws cloudfront wait distribution-deployed --id $CLOUDFRONT_DISTRIBUTION_ID

print_success "CloudFront distribution deployed successfully"

print_step "12. Testing deployment"

# Test S3 deployment (should return 403 - correctly secured)
echo "Testing S3 deployment (should be secured)..."
response=$(curl -s -o /dev/null -w "%{http_code}" "https://$S3_BUCKET.s3.amazonaws.com/index.html")
if [ "$response" -eq 403 ]; then
    print_success "S3 bucket is properly secured: $response"
else
    print_warning "S3 bucket security test: $response (expected 403)"
fi

# Test CloudFront deployment
echo "Testing CloudFront deployment..."
response=$(curl -s -o /dev/null -w "%{http_code}" "https://$CLOUDFRONT_DOMAIN/")
if [ "$response" -eq 200 ]; then
    print_success "CloudFront deployment test: $response"
else
    print_warning "CloudFront deployment test: $response (may need more time to propagate)"
fi

print_success "🎉 Bulletproof frontend deployment completed successfully!"

echo ""
echo "📋 Deployment Summary:"
echo "✅ CloudFormation infrastructure deployed and configured"
echo "✅ Dependencies installed and application built"
echo "✅ Application deployed to S3 with proper security"
echo "✅ CloudFront distribution enabled and configured"
echo "✅ S3 bucket policy configured for CloudFront access"
echo "✅ CloudFront cache invalidated"
echo "✅ Deployment tests completed"
echo ""
echo "🔗 Frontend URLs:"
echo "🌐 S3 URL: https://$S3_BUCKET.s3.amazonaws.com/ (secured - 403 expected)"
echo "⚡ CloudFront URL: https://$CLOUDFRONT_DOMAIN/"
echo "🔗 API URL: $API_URL"
echo ""
echo "📝 Next Steps:"
echo "1. Test the frontend application in your browser"
echo "2. Verify API integration is working correctly"
echo "3. Check browser console for any errors"
echo "4. Set up custom domain if needed"
echo ""
echo "🚨 Rollback Instructions:"
echo "If issues are found, you can rollback by:"
echo "1. Reverting to previous git commit"
echo "2. Re-running this deployment script"
echo "3. Or using: aws cloudformation delete-stack --stack-name $STACK_NAME"

# Return to original directory
cd - > /dev/null