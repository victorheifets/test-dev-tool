# Controlled Deployment Guide - Manual GitHub Actions
**Date**: July 16, 2025  
**System**: Course Management System  
**Deployment Strategy**: Manual control with safety checks

---

## 🎯 **Overview**

This system uses **manual deployment control** instead of automatic deployments. You have full control over when and how deployments happen through GitHub Actions workflows.

### **Key Features:**
- ✅ **Manual triggers only** - No automatic deployments on push
- ✅ **Safety confirmations** - Must type "DEPLOY" to confirm
- ✅ **Environment separation** - Deploy to staging or production
- ✅ **Test controls** - Can skip tests for staging (not production)
- ✅ **Migration control** - Choose when to run database migrations
- ✅ **Health checks** - Automatic validation after deployment

---

## 🚀 **How to Deploy**

### **Frontend Deployment**

1. **Go to GitHub Actions** in your repository
2. **Click "Deploy Frontend to AWS"** workflow
3. **Click "Run workflow"** button
4. **Fill in the form:**
   - **Environment**: Choose `staging` or `production`
   - **Confirm deployment**: Type exactly `DEPLOY`
   - **Skip tests**: Check only for staging if needed
5. **Click "Run workflow"** green button

### **Backend Deployment**

1. **Go to GitHub Actions** in your repository
2. **Click "Deploy Backend API to AWS"** workflow
3. **Click "Run workflow"** button
4. **Fill in the form:**
   - **Environment**: Choose `staging` or `production`
   - **Confirm deployment**: Type exactly `DEPLOY`
   - **Skip tests**: Check only for staging if needed
   - **Run migrations**: Usually leave checked
5. **Click "Run workflow"** green button

---

## 🔒 **Safety Features**

### **Confirmation Required**
- Must type `DEPLOY` exactly (case-sensitive)
- Without this, deployment will fail immediately

### **Production Protection**
- Cannot skip tests for production deployments
- Extra validation steps for production
- Environment-specific configurations

### **Pre-deployment Validation**
- Confirms deployment parameters
- Validates environment settings
- Checks for required inputs

---

## 📋 **Deployment Workflow Steps**

### **Frontend Workflow Steps:**
1. **Validate deployment** - Check confirmation and environment
2. **Test and build** - Run linting, type checking, tests
3. **Build production** - Create optimized build
4. **Deploy to S3** - Upload files with proper caching
5. **Invalidate CloudFront** - Clear CDN cache (production only)
6. **Health check** - Verify deployment success
7. **Summary** - Show deployment details

### **Backend Workflow Steps:**
1. **Validate deployment** - Check confirmation and environment
2. **Test and build** - Run linting, type checking, tests
3. **Build SAM application** - Package Lambda function
4. **Deploy SAM stack** - Deploy to AWS with CloudFormation
5. **Run migrations** - Update database schema (if selected)
6. **Health check** - Test API endpoints
7. **Validate endpoints** - Test key API routes
8. **Summary** - Show deployment details

---

## 🌍 **Environment Configuration**

### **Frontend Environments**

#### **Staging**
- **S3 Bucket**: `test-dev-tool-staging-764414385399`
- **CloudFront**: `staging-placeholder` (needs to be created)
- **URL**: `https://staging-placeholder.cloudfront.net/`

#### **Production**
- **S3 Bucket**: `test-dev-tool-prod-764414385399`
- **CloudFront**: `E2MY7WM6N3WVGB`
- **URL**: `https://d3ld4gkanad66u.cloudfront.net/`

### **Backend Environments**

#### **Staging**
- **Stack Name**: `course-management-api-staging`
- **API URL**: `https://staging-api.execute-api.eu-west-1.amazonaws.com/staging`
- **Health Check**: `/api/health`

#### **Production**
- **Stack Name**: `course-management-api-prod` (current stack)
- **API URL**: `https://lph40ds6v8.execute-api.eu-west-1.amazonaws.com/prod`
- **Health Check**: `/api/health`

---

## 🔧 **Required Setup**

### **GitHub Secrets Configuration**

You need to add these secrets to your GitHub repository:

1. **Go to your repository on GitHub**
2. **Click Settings → Secrets and variables → Actions**
3. **Add these Repository secrets:**

```bash
AWS_ACCESS_KEY_ID = your-aws-access-key-id
AWS_SECRET_ACCESS_KEY = your-aws-secret-access-key
```

### **AWS Permissions Required**

Your AWS credentials need these permissions:
- **S3**: Full access to deployment buckets
- **CloudFront**: Create/update distributions and invalidations
- **Lambda**: Deploy and manage functions
- **API Gateway**: Create and manage APIs
- **CloudFormation**: Create and manage stacks
- **DynamoDB**: Read/write access to tables
- **IAM**: Create roles for Lambda functions

---

## 🎛️ **Deployment Options**

### **Frontend Deployment Options**

#### **Environment Selection**
- **Staging**: For testing changes before production
- **Production**: For live user-facing deployment

#### **Skip Tests**
- **Staging**: Can skip tests for faster deployment
- **Production**: Tests are mandatory, cannot skip

#### **What Gets Deployed**
- React application build
- Static assets (CSS, JS, images)
- Locale files
- Updated with current API configuration

### **Backend Deployment Options**

#### **Environment Selection**
- **Staging**: For testing API changes
- **Production**: For live API deployment

#### **Skip Tests**
- **Staging**: Can skip tests for faster deployment
- **Production**: Tests are mandatory, cannot skip

#### **Run Migrations**
- **Checked**: Run database schema updates
- **Unchecked**: Skip database changes

#### **What Gets Deployed**
- Lambda function code
- API Gateway configuration
- DynamoDB table updates
- IAM roles and policies

---

## 📊 **Monitoring Deployment**

### **During Deployment**
- **GitHub Actions tab** shows real-time progress
- **Each step** shows success/failure status
- **Logs** available for troubleshooting

### **After Deployment**
- **Health checks** automatically validate deployment
- **Summary** shows all deployment details
- **URLs** provided for testing

### **Deployment Artifacts**
- **Build artifacts** stored for 7 days
- **Deployment logs** available in GitHub Actions
- **CloudFormation events** in AWS Console

---

## 🔄 **Rollback Process**

### **Automatic Rollback**
- **Health check failure** → deployment fails
- **Build failure** → deployment stops
- **Test failure** → deployment stops (if tests enabled)

### **Manual Rollback**
Currently rollback is manual:
1. **Identify last known good version** from Git history
2. **Deploy previous version** using GitHub Actions
3. **Verify rollback success** through health checks

### **Future Rollback Automation**
- Store deployment artifacts
- Tag deployments with versions
- Create one-click rollback automation

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **"Deployment not confirmed"**
- **Cause**: Didn't type "DEPLOY" exactly
- **Fix**: Type `DEPLOY` in all caps

#### **"Cannot skip tests for production"**
- **Cause**: Tried to skip tests for production
- **Fix**: Uncheck "Skip tests" for production

#### **"Health check failed"**
- **Cause**: Deployment completed but app not accessible
- **Fix**: Check CloudFront status, wait for DNS propagation

#### **"SAM build failed"**
- **Cause**: Code issues or dependency problems
- **Fix**: Check code, update dependencies, run tests locally

### **Debugging Steps**

1. **Check GitHub Actions logs** for detailed error messages
2. **Review AWS CloudFormation** stack events
3. **Test locally** before deploying
4. **Check AWS Lambda logs** for runtime errors
5. **Verify AWS credentials** have proper permissions

---

## 📚 **Best Practices**

### **Before Deployment**
- ✅ **Test locally** to ensure code works
- ✅ **Review changes** in pull request
- ✅ **Deploy to staging first** before production
- ✅ **Verify staging deployment** works correctly

### **During Deployment**
- ✅ **Monitor GitHub Actions** for progress
- ✅ **Don't interrupt** running deployments
- ✅ **Check logs** if deployment fails
- ✅ **Verify health checks** pass

### **After Deployment**
- ✅ **Test the deployed application** manually
- ✅ **Check monitoring** for any issues
- ✅ **Document** any problems encountered
- ✅ **Notify team** of successful deployment

---

## 🎯 **Quick Reference**

### **Deployment Checklist**
- [ ] Code changes tested locally
- [ ] Pull request reviewed and approved
- [ ] Staging deployment successful
- [ ] Production deployment confirmed
- [ ] Health checks passing
- [ ] Manual testing completed

### **Emergency Contacts**
- **Deployment Issues**: Check GitHub Actions logs
- **AWS Issues**: Check CloudFormation console
- **Application Issues**: Check Lambda logs
- **DNS Issues**: Check CloudFront status

---

## 🔮 **Future Enhancements**

### **Planned Improvements**
- **Automated staging** deployment on PR merge
- **One-click rollback** functionality
- **Deployment approvals** for production
- **Slack notifications** for deployment status
- **Blue-green deployment** for zero downtime

### **Advanced Features**
- **Canary deployments** for gradual rollouts
- **Feature flags** for controlled feature releases
- **Performance monitoring** during deployment
- **Automated rollback** on health check failures

---

**This controlled deployment system gives you full control over when and how your applications are deployed while maintaining safety and reliability.**