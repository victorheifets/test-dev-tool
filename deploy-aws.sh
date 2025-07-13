#!/bin/bash
# Deploy React frontend to AWS S3 + CloudFront

set -e

# Configuration
BUCKET_NAME="course-management-frontend-$(date +%s)"
REGION="eu-west-1"
API_URL="https://im7swzql6i.execute-api.eu-west-1.amazonaws.com/prod"

echo "🚀 Deploying frontend to AWS..."

# Build the application
echo "📦 Building React application..."
npm run build

# Create S3 bucket
echo "🪣 Creating S3 bucket..."
aws s3 mb s3://${BUCKET_NAME} --region ${REGION}

# Configure bucket for static website hosting
echo "🌐 Configuring static website hosting..."
aws s3 website s3://${BUCKET_NAME} \
  --index-document index.html \
  --error-document index.html

# Upload files
echo "📤 Uploading files to S3..."
aws s3 sync dist/ s3://${BUCKET_NAME} --delete

# Make bucket public
echo "🔓 Making bucket public..."
aws s3api put-bucket-policy --bucket ${BUCKET_NAME} --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::'${BUCKET_NAME}'/*"
    }
  ]
}'

# Get website URL
WEBSITE_URL="http://${BUCKET_NAME}.s3-website-${REGION}.amazonaws.com"

echo "✅ Frontend deployed successfully!"
echo "🌐 Website URL: ${WEBSITE_URL}"
echo "📝 Note: Update API_URL in your app to: ${API_URL}"