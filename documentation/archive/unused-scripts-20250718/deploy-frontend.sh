#!/bin/bash
# Frontend Deployment Script - PREPARED BUT NOT EXECUTED

set -e

STACK_NAME="test-dev-tool-frontend"
REGION="eu-west-1"
ENVIRONMENT="prod"

echo "🚀 Preparing CloudFront deployment (DISABLED by default)"

# Step 1: Deploy CloudFormation stack (CloudFront will be disabled)
echo "📦 Deploying CloudFormation stack..."
aws cloudformation deploy \
  --template-file cloudfront-deployment.yaml \
  --stack-name ${STACK_NAME} \
  --parameter-overrides Environment=${ENVIRONMENT} \
  --capabilities CAPABILITY_IAM \
  --region ${REGION} \
  --no-execute-changeset  # PREPARE ONLY, DON'T EXECUTE

echo "✅ CloudFormation stack prepared (not deployed yet)"

# Step 2: Build frontend (prepare build artifacts)
echo "🔨 Building frontend..."
npm run build

echo "📁 Build artifacts ready in dist/"

# Step 3: Get stack outputs (when stack is deployed)
echo "📋 Deployment commands prepared:"
echo ""
echo "# To deploy the stack:"
echo "aws cloudformation execute-change-set --change-set-name [CHANGESET-NAME] --stack-name ${STACK_NAME} --region ${REGION}"
echo ""
echo "# To upload frontend files:"
echo "BUCKET_NAME=\$(aws cloudformation describe-stacks --stack-name ${STACK_NAME} --region ${REGION} --query 'Stacks[0].Outputs[?OutputKey==\`BucketName\`].OutputValue' --output text)"
echo "aws s3 sync dist/ s3://\$BUCKET_NAME/ --delete"
echo ""
echo "# To enable CloudFront distribution:"
echo "DISTRIBUTION_ID=\$(aws cloudformation describe-stacks --stack-name ${STACK_NAME} --region ${REGION} --query 'Stacks[0].Outputs[?OutputKey==\`DistributionId\`].OutputValue' --output text)"
echo "aws cloudfront update-distribution --id \$DISTRIBUTION_ID --distribution-config file://enable-distribution.json"
echo ""
echo "🔒 IMPORTANT: CloudFront distribution is DISABLED by default for security"
echo "💤 Ready for deployment when you wake up!"