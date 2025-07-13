# Test-Dev-Tool Frontend - Documentation Index

**Status**: Reorganized July 10, 2025  
**Purpose**: Central navigation for all frontend project documentation  

---

## 📚 Documentation Categories

### 🔌 Integration
- **[Integration Status](integration/check-integration.md)** - Current integration status and testing procedures
- **[API Integration Guide](integration/.client_integration_guide.md)** - Multi-tenant API integration patterns
- **[Endpoint Comparison](integration/endpoint_comparison.md)** - Before/after API endpoint analysis

### 🔧 Development
- **[Technical Debt](development/TECHNICAL_DEBT.md)** - Bug tracking, technical debt, and known issues

### 🔒 Security
- **[Security Evaluation](security/client_evaluation.md)** - **CRITICAL** - Comprehensive security vulnerability analysis

### 📋 Planning
- **[Feature Backlog](planning/BACKLOG.md)** - SaaS admin panel feature roadmap and user stories

### ⭐ Features
- **[Landing Builder v2](features/landing-builder-v2.md)** - Landing page builder feature documentation
- **[TipTap Demo](features/TipTapDemo.md)** - TipTap rich text editor integration

---

## 🚨 Critical Security Notice

**IMMEDIATE ATTENTION REQUIRED**: The [Security Evaluation](security/client_evaluation.md) documents critical vulnerabilities:
- **CVSS 9.8**: Authentication bypass vulnerability
- **CVSS 8.5**: Hardcoded multi-tenant identifier  
- **CVSS 7.5**: Insecure token storage
- **CVSS 5.3**: Information disclosure

**These vulnerabilities must be addressed before production deployment.**

---

## 🔍 Quick Reference

### New Developer Setup
1. **Project Setup**: Start with main [README.MD](../README.MD)
2. **API Integration**: Review [API Integration Guide](integration/.client_integration_guide.md)
3. **Security Issues**: **CRITICAL** - Read [Security Evaluation](security/client_evaluation.md)

### Current Development
1. **Known Issues**: Check [Technical Debt](development/TECHNICAL_DEBT.md)
2. **Integration Status**: Verify [Integration Status](integration/check-integration.md)
3. **Feature Progress**: Review [Feature Backlog](planning/BACKLOG.md)

### Feature Development
1. **Landing Pages**: [Landing Builder v2](features/landing-builder-v2.md)
2. **Rich Text**: [TipTap Demo](features/TipTapDemo.md)
3. **API Changes**: [Endpoint Comparison](integration/endpoint_comparison.md)

---

## 🔄 Integration Status

### Backend Integration
- **Authentication**: Partially integrated (with development bypass)
- **CRUD Operations**: Fully integrated with course-management-api
- **Data Provider**: Custom implementation working
- **Schema Alignment**: Recently completed

### Outstanding Integration Tasks
- **Landing Page Persistence**: No backend storage implemented
- **File Upload**: Not yet integrated
- **Real-time Analytics**: Currently using mock data

### Recent Fixes
- **DynamoDB Schema**: Fixed composite key structure for activities table (July 12, 2025)
- **Query Errors**: Resolved "Query key condition not supported" error

---

## 📋 System Overview

### Technology Stack
- **Framework**: React with Refine
- **UI Library**: Material-UI (MUI)  
- **Language**: TypeScript
- **State Management**: React Hook Form + Refine data provider
- **Authentication**: Custom auth provider with JWT

### Feature Status
- ✅ **CRUD Operations**: Complete for all entities
- ✅ **Admin Interface**: Professional dashboard and forms
- ✅ **Responsive Design**: Mobile and desktop support
- ⚠️ **Security**: Critical vulnerabilities need fixing
- ⚠️ **Testing**: No automated tests implemented

---

## 🗂️ Document Summary

| Category | Files | Priority | Status |
|----------|-------|----------|---------|
| Integration | 3 | High | ✅ Current |
| Development | 1 | High | ⚠️ Needs Updates |
| **Security** | **1** | **CRITICAL** | **🔴 Action Required** |
| Planning | 1 | Medium | ✅ Current |
| Features | 2 | Medium | ✅ Current |
| **Total** | **8** | **Mixed** | **1 Critical Issue** |

---

## 🔄 Documentation Maintenance

### Update Guidelines
- Update technical debt tracker with resolved issues
- Document new features as they're implemented
- Keep integration status current with backend changes
- **Security documentation must be updated immediately when vulnerabilities are fixed**

### Review Schedule
- **Security**: Immediate review after any security fixes
- **Technical Debt**: Weekly updates during active development
- **Integration**: Updated with each backend API change
- **Features**: Updated with each feature release

---

**This frontend application serves as the admin interface for the Course Management Platform, providing comprehensive multi-tenant course administration capabilities.**