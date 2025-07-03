# Technical Debt - Known Issues & Bugs

**Last Updated**: July 2, 2025  
**Project**: Course Management Frontend (test-dev-tool)  
**Status**: Active tracking of unresolved issues

## ✅ Recently Fixed Issues

### Provider ID Mismatch Resolution
**Date Fixed**: July 3, 2025  
**Issue**: Frontend using `ffa6c96f-e4a2-4df2-8298-415daa45d23c`, backend defaulting to `00000000-0000-0000-0000-000000000000`  
**Solution**: Updated backend middleware to use matching provider ID  
**Impact**: All GET/UPDATE/DELETE operations now work correctly for participants, activities, enrollments  

### DynamoDB Composite Key Query Issues
**Date Fixed**: July 3, 2025  
**Issue**: BaseRepository GET operations not passing provider_id to service layer  
**Solution**: Updated BaseCRUDRouter to extract provider_id from request state and pass to service methods  
**Impact**: Multi-tenant isolation now working correctly with composite keys  

### Database Retry Logic Implementation
**Date Fixed**: July 3, 2025  
**Issue**: No retry mechanisms for transient DynamoDB failures  
**Solution**: Added exponential backoff retry logic with proper error handling  
**Impact**: Improved resilience against temporary database connection issues  

### Global Exception Handler
**Date Fixed**: July 3, 2025  
**Issue**: Unhandled exceptions exposing stack traces to clients  
**Solution**: Implemented application-wide exception handler with environment-specific error details  
**Impact**: Improved security and user experience during errors  

## 🚨 Critical Issues

### 1. Delete Operations Failing
**Status**: Backend Issue  
**Symptom**: Delete works but throws JSON parsing error  
**Error**: `Failed to execute 'json' on 'Response': Unexpected end of JSON input`  
**Impact**: User sees error despite successful deletion  
**Root Cause**: Backend DELETE endpoints returning empty response body instead of JSON  
**Location**: All delete operations (courses, participants, enrollments, leads)  

### 2. Notification System Not Working
**Status**: Configuration Issue  
**Symptom**: No snack bar notifications appear for any operations  
**Impact**: Users get no feedback on success/error operations  
**Expected**: Toast notifications for create/update/delete operations  
**Root Cause**: Refine notification provider not properly configured

## ⚠️ Frontend Issues

### 3. Backend CRUD Operations Failing for Non-Activity Entities
**Status**: Critical Backend Issue  
**Symptom**: All UPDATE/DELETE operations fail with 404 "not found" errors  
**Impact**: Only CREATE and LIST work - no editing or deleting possible  
**Affected**: Participants, Enrollments, Leads (Activities work correctly)  
**Root Cause**: DynamoDB tenant isolation query issues - backend can't find records by ID  
**Evidence**: `PUT /api/participants/{id}` returns 404 even for existing records  
**Frontend Impact**: All entity management broken except for courses  

### 4. Authentication Development Bypass
**Status**: Temporary Workaround  
**Implementation**: Development mode bypasses all authentication  
**Security Risk**: No authentication in development environment  
**Todo**: Implement proper dev authentication or mock login system  

### 5. Provider ID Hardcoding - SECURITY CRITICAL
**Status**: Security Vulnerability - Requires Architectural Redesign  
**Current Implementation**: Hardcoded provider ID in `/src/config/provider.ts`  
**Hardcoded Value**: `'ffa6c96f-e4a2-4df2-8298-415daa45d23c'`  
**Security Risk**: All users share same tenant/provider - NO data isolation  
**Impact**: Users can potentially see other organizations' data  

**Current Usage Pattern:**
- Used in `API_CONFIG.defaultProviderId` 
- Sent as `X-Provider-ID` header in ALL API requests
- Imported across modal components for tenant context
- Single provider ID for entire application instance

**Architectural Problem:**
```typescript
// Current insecure implementation:
export const PROVIDER_ID = 'ffa6c96f-e4a2-4df2-8298-415daa45d23c'; // HARDCODED!
export const getProviderId = (): string => {
  return PROVIDER_ID; // Same for ALL users
};
```

**Recommended Solutions:**

**Option A: Environment-Based (Quick Fix)**
```typescript
// Different provider per deployment environment
export const PROVIDER_ID = import.meta.env.VITE_PROVIDER_ID || 'default-provider-id';
```
- ✅ Good for: Single-tenant deployments, testing
- ❌ Limited: Still one provider per app instance

**Option B: Dynamic Multi-Tenant (Proper Solution)**
```typescript
// Provider ID extracted from user's JWT token
export const getProviderId = (): string => {
  const token = localStorage.getItem('auth-token');
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.provider_id; // Different per logged-in user
};
```

**Multi-Tenant Architecture Flow:**
1. **User Login** → JWT contains `provider_id` from their organization
2. **API Requests** → `X-Provider-ID` header uses user's provider ID  
3. **Backend Filtering** → All queries filtered by user's provider ID
4. **Data Isolation** → Each organization sees only their data

**Security Benefits of Option B:**
- ✅ **True Multi-Tenancy**: Each organization isolated
- ✅ **Scalable**: Unlimited organizations on same app
- ✅ **Secure**: Users can't access other orgs' data
- ✅ **Token-Based**: Provider context tied to authentication

**Implementation Requirements:**
- Frontend: Extract provider from JWT token
- Backend: Validate JWT provider matches request header
- Database: All queries must filter by provider_id
- Authentication: Include provider_id in JWT payload

**Real-World Example:**
```
School A User logs in → provider_id: "school-a-uuid"
  ├── Sees only School A courses, students, enrollments
  └── Cannot access School B data

School B User logs in → provider_id: "school-b-uuid"  
  ├── Sees only School B courses, students, enrollments
  └── Cannot access School A data
```

**Priority**: **CRITICAL** - This is a fundamental security architecture issue that affects data privacy and compliance  

## 🔧 Minor Technical Debt

### 6. Dashboard Using Mock Data
**Status**: Incomplete Feature  
**Current**: Static mock data for all dashboard statistics  
**Expected**: Real-time data from backend APIs  
**Impact**: Dashboard shows fake metrics  

### 7. Landing Page Builder No Persistence
**Status**: Feature Limitation  
**Current**: Landing pages only exist in memory  
**Expected**: Save/load landing page configurations  
**Impact**: All landing page work is lost on refresh  

### 8. Error Handling Inconsistencies
**Status**: Code Quality Issue  
**Problem**: Mixed error handling patterns across components  
**Examples**: Some use try/catch, others rely on Refine error handlers  
**Impact**: Inconsistent user experience during errors  

### 9. Type Safety Issues
**Status**: Code Quality Issue  
**Problem**: Some components use `any` types  
**Location**: Event handlers, API responses  
**Impact**: Runtime errors not caught at compile time  

### 10. Missing Form Validation
**Status**: UX Issue  
**Problem**: Client-side validation incomplete  
**Examples**: Email format, phone number format, date ranges  
**Impact**: Invalid data can be submitted  

## 🎯 Performance Issues

### 11. Client-Side Filtering on Large Datasets
**Status**: Performance Risk  
**Current**: All filtering done in browser  
**Impact**: Slow performance with >100 records  
**Solution**: Implement server-side filtering  

### 12. Bundle Size Not Optimized
**Status**: Performance Issue  
**Problem**: No code splitting, loads entire app upfront  
**Impact**: Slow initial page load  
**Solution**: Implement route-based code splitting  

## 📋 Missing Features

### 13. File Upload Functionality
**Status**: Feature Gap  
**Missing**: Course materials, participant photos, certificates  
**Impact**: Limited content management capabilities  

### 14. Bulk Operations
**Status**: Feature Gap  
**Missing**: Bulk delete, bulk update, CSV import/export  
**Impact**: Manual work for batch operations  

### 15. Advanced Search
**Status**: Feature Gap  
**Current**: Simple text search only  
**Missing**: Date ranges, multiple filters, saved searches  

### 16. Email Integration
**Status**: Feature Gap  
**Missing**: Email notifications, templates, automation  
**Impact**: Manual communication with participants  

## 🧪 Testing Debt

### 17. No Unit Tests
**Status**: Quality Risk  
**Coverage**: 0% unit test coverage  
**Impact**: Regressions not caught during development  

### 18. No Integration Tests
**Status**: Quality Risk  
**Coverage**: No API integration testing  
**Impact**: Frontend-backend compatibility issues  

### 19. No E2E Tests
**Status**: Quality Risk  
**Coverage**: No user workflow testing  
**Impact**: User-facing bugs in production  

## 🔄 Refactoring Needed

### 20. Inconsistent State Management
**Status**: Architecture Debt  
**Problem**: Mix of local state, Refine cache, and manual refresh  
**Impact**: State synchronization issues  

### 21. Code Duplication
**Status**: Maintenance Burden  
**Examples**: Similar CRUD patterns across entity pages  
**Impact**: Changes need to be made in multiple places  

### 22. Hard-coded Configuration
**Status**: Deployment Issue  
**Examples**: API URLs, provider IDs, feature flags  
**Impact**: Difficult to deploy across environments  

## 📊 Priority Matrix

### High Priority (Production Blockers)
- ~~Delete operations JSON parsing error~~ ✅ FIXED: Provider ID mismatch resolved
- ~~Notification system not working~~ (Not addressed - requires frontend notification provider configuration)
- ~~Backend GET by ID failures~~ ✅ FIXED: Provider ID alignment and composite key fixes implemented

### Critical Security Issues Deferred
- **CORS wildcard configuration**: Backend allows `origins=["*"]` - security risk for production
- **JWT validation integration**: Provider context middleware bypasses proper JWT validation
- **Rate limiting missing**: No protection against brute force attacks
- **Input validation gaps**: Not systematically applied across all endpoints

### Backend Mock Data Validation Issues
**Date Added**: July 3, 2025  
**Status**: Technical Debt  
**Issue**: Mock database sample data has validation errors preventing API testing  
**Problems**:
- Non-UUID format IDs (`pt1`, `pt2`, etc.) causing UUID validation errors
- Missing required `provider_id` field on participant records
- Mock data doesn't match current Pydantic schema requirements
**Impact**: Cannot test endpoints with mock database - all LIST operations fail
**Location**: `/app/db/mock_db.py` sample data section
**Solution Required**: Update mock data to use proper UUID format and include all required fields per current schemas

### Medium Priority (UX Issues)
- Form validation missing
- Authentication bypass
- Provider ID inconsistencies

### Low Priority (Technical Improvements)
- Dashboard mock data
- Landing page persistence
- Performance optimizations

## 🎯 Recommended Next Steps

1. **Immediate (This Week)**
   - Fix delete operation JSON parsing
   - Configure notification system
   - Centralize provider ID configuration

2. **Short Term (Next 2 Weeks)**
   - Implement proper form validation
   - Add basic unit test coverage
   - Fix backend GET by ID issues

3. **Medium Term (Next Month)**
   - Implement real dashboard data
   - Add file upload functionality
   - Performance optimizations

4. **Long Term (Next Quarter)**
   - Complete test coverage
   - Advanced search features
   - Email integration system

---

*This document should be updated as issues are resolved and new technical debt is identified.*