# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Recent Updates (2025-08-01)
### Mobile-Responsive Registration Forms
- **Registration Form Builder**: Preview modal now displays full-screen on mobile devices
- **Published Registration Forms**: Public forms display as full-screen mobile modals for optimal UX
- **Hebrew Localization**: Fixed logout button translation - now properly displays "התנתק" in Hebrew
- **Form Field Optimization**: Replaced problematic description textarea with working testField1
- **Mobile Touch UX**: All form elements use appropriate mobile sizing and touch-friendly interactions

### Technical Implementation
- Modified `src/pages/registration-form/index.tsx` to use `CommonModalShell` with `fullScreen={isMobile}`
- Updated `src/pages/registration-form/public.tsx` for mobile-first responsive design
- Fixed `src/components/header/index.tsx` logout translation with direct language check
- Enhanced form state management to properly reflect edits in preview and publish

### Deployment Status
- **Frontend**: Deployed to CloudFront (https://d3ld4gkanad66u.cloudfront.net/)
- **Backend**: Deployed to AWS Lambda (https://lph40ds6v8.execute-api.eu-west-1.amazonaws.com/prod)

## Development Commands

### Core Development Workflow
```bash
npm run dev           # Start development server with Vite + React
npm run build         # Production build (TypeScript compile + Vite build)
npm run build:prod    # Production build with prod config
npm run start         # Start production server
npm run api           # Start mock API server (json-server)
```

### Type Generation & Validation
```bash
npm run generate-types              # Generate TypeScript types from backend API
npm run generate-types:force        # Force regenerate types (ignore cache)
npm run types:validate              # Validate generated types compile correctly
npm run test:schema-drift           # Check for API schema changes
```

### Testing Commands
```bash
npm run test                # Run all tests (types + unit tests)
npm run test:types         # Run type validation tests only
npm run test:quick         # Quick smoke tests (type validation)
npm run health-check       # Check if backend API is responding
```

## Project Architecture

### Core Framework Stack
- **Frontend Framework**: React 18 with TypeScript
- **Admin Framework**: [Refine](https://refine.dev) - React framework for internal tools/admin panels
- **UI Library**: Material-UI (MUI) v6 with custom theming
- **Build Tool**: Vite with React plugin
- **Router**: React Router v7 with Refine router bindings
- **Forms**: React Hook Form with Yup validation
- **Data Grid**: MUI X Data Grid for table components
- **Internationalization**: i18next with React integration

### Backend Integration
- **API Base**: `http://localhost:8082` (proxied through Vite dev server)
- **Data Provider**: Custom Refine data provider in `src/providers/dataProvider.ts`
- **Authentication**: Google OAuth via `@react-oauth/google`
- **API Client**: Custom HTTP client with comprehensive error handling

### Key Architectural Patterns

#### Resource-Based Navigation
The app follows Refine's resource-based pattern where each business entity (courses, participants, enrollments, leads) maps to:
- A navigation item in `src/config/navigation.tsx`  
- A list page in `src/pages/{resource}/list.tsx`
- Form components in `src/components/{resource}/`
- Data transformations in the data provider

#### Mobile-First Responsive Design
- **Breakpoint System**: Uses MUI breakpoints (`useMediaQuery(theme.breakpoints.down('md'))`)
- **Desktop**: Full sidebar navigation with ThemedLayoutV2
- **Mobile**: Bottom navigation bar (`src/components/mobile/BottomNavigation.tsx`) + compact cards
- **Responsive Components**: Separate mobile/desktop component variants in `src/components/mobile/`

#### Error Handling Strategy
- **Centralized**: `src/utils/errorHandler.ts` with `AppError` class
- **Pydantic Integration**: Parses FastAPI/Pydantic validation errors into user-friendly messages
- **Error Boundaries**: React error boundaries in `src/components/ErrorBoundary.tsx`
- **API Errors**: Comprehensive HTTP error parsing in data provider

#### Form Validation Architecture
- **Validated Components**: Wrapper components in `src/components/common/validated/`
- **Schema Validation**: Yup schemas integrated with React Hook Form
- **Custom Hook**: `src/hooks/useValidatedForm.ts` for form state management
- **API Integration**: Form errors automatically mapped from backend validation

## Data Layer Architecture

### Resource Mapping
The frontend uses business-friendly names that map to backend endpoints:
```typescript
// src/providers/dataProvider.ts - resourceMap
'courses' → 'activities'     // Course management maps to activity API
'participants' → 'participants'
'enrollments' → 'enrollments'  
'leads' → 'marketing'        // Lead management uses marketing API
'sms' → 'sms'               // SMS messaging
```

### Data Transformations
- **Course ↔ Activity**: Complex pricing objects simplified for UI, restored for API
- **Date Handling**: Consistent date formatting between frontend/backend
- **Validation**: Pydantic errors parsed into user-friendly messages
- **Provider Context**: JWT tokens automatically added to API requests

### API Integration Patterns
```typescript
// Standard CRUD operations through Refine
const { data, isLoading } = useList({ resource: 'courses' });
const { mutate } = useCreate({ resource: 'participants' });

// Custom API calls through data provider
const { data } = useCustom({
  url: '/api/enrollments/enroll-flexible',
  method: 'post',
  config: { payload: flexibleEnrollmentData }
});
```

## Component Architecture

### Refine Integration Components
- **List Pages**: Use `useList()`, `<List>`, and MUI DataGrid
- **Forms**: Integrate `useForm()` with React Hook Form and MUI components  
- **Actions**: Standard edit/delete actions through `useUpdate()`, `useDelete()`
- **Modals**: Modal shells with form integration in `src/components/{resource}/`

### Shared Component Library
```
src/components/common/
├── validated/           # Form input wrappers with validation
├── SharedDataGrid.tsx   # Standardized data grid configuration
├── ConfirmationDialog.tsx  # Reusable confirmation dialogs
└── CommonModalShell.tsx    # Modal wrapper with consistent styling
```

### Mobile-Specific Components
```
src/components/mobile/
├── CompactCardShell.tsx     # Mobile card container
├── Compact{Resource}Card.tsx # Resource-specific mobile cards
├── ResponsiveDataView.tsx    # Responsive list/grid switcher
└── PullToRefresh.tsx        # Mobile pull-to-refresh functionality  
```

## Styling and Theming

### MUI Theme Customization
- **Primary Color**: Purple gradient (`#7367F0` to `#9C88FF`)
- **Theme Provider**: `src/contexts/color-mode/` with dark/light mode support
- **Global Overrides**: `src/styles/globalOverrides.tsx` for consistent styling
- **Form Styles**: Centralized form styling in `src/styles/formStyles.ts`

### Responsive Patterns
```typescript
// Standard responsive pattern used throughout
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('md'));

return isMobile ? <MobileComponent /> : <DesktopComponent />;
```

## Development Patterns

### Type Safety
- **Generated Types**: API types auto-generated in `src/types/generated/`
- **Custom Types**: Business logic types in `src/types/{domain}.ts`
- **Validation Schemas**: Zod schemas for runtime validation
- **Type Validation**: `npm run types:validate` ensures type safety

### Error Handling Best Practices
- **User-Friendly Messages**: Always parse technical errors into readable text
- **Logging**: Use `logError()` for debugging while showing clean errors to users  
- **Graceful Degradation**: Handle API failures without breaking the UI
- **Error Recovery**: Provide actionable error messages with retry options

### Testing Strategy
- **Type Tests**: Ensure generated types compile (`test:types`)
- **Schema Drift**: Detect API changes (`test:schema-drift`) 
- **Health Checks**: Verify backend connectivity (`health-check`)
- **Unit Tests**: Framework ready for Jest/Vitest implementation

## Development Workflow

### Backend Integration
1. **API First**: Backend API expected at `localhost:8082`
2. **Type Generation**: Run `npm run generate-types` after API changes
3. **Schema Validation**: `npm run test:schema-drift` detects breaking changes
4. **Error Testing**: Test error scenarios to ensure proper user messaging

### Form Development
1. Use validated components from `src/components/common/validated/`
2. Integrate with `useValidatedForm()` hook for consistent error handling
3. Test both client-side validation and server-side error responses
4. Ensure mobile responsiveness with form layouts

### Mobile Development  
1. **Mobile-First**: Design mobile layouts first, then enhance for desktop
2. **Breakpoint Testing**: Test responsive behavior at various screen sizes
3. **Touch Interactions**: Ensure proper touch targets and mobile UX patterns
4. **Performance**: Optimize for mobile devices with code splitting

### API Integration
1. **Resource Mapping**: Understand frontend→backend resource name mapping
2. **Data Transformations**: Handle data shape differences in data provider
3. **Error Handling**: Test error scenarios and ensure good user experience  
4. **Authentication**: JWT tokens handled automatically via auth provider

## Key Files Reference

### Core Configuration
- `src/App.tsx` - Main app component with routing and providers
- `src/config/navigation.tsx` - Resource definitions and navigation structure
- `src/providers/dataProvider.ts` - Backend API integration layer
- `src/providers/authProvider.ts` - Authentication logic
- `vite.config.ts` - Development server configuration with API proxy

### Type System
- `src/types/generated/` - Auto-generated API types (do not edit manually)
- `src/types/{domain}.ts` - Business domain type definitions
- `tsconfig.json` - TypeScript configuration

### Styling
- `src/contexts/color-mode/` - Theme and dark mode logic  
- `src/styles/globalOverrides.tsx` - Global MUI theme overrides
- `public/locales/{lang}/common.json` - Internationalization strings

## Important Constraints

### Type Generation Dependencies
- Types are generated from backend API at `../course-management-api`
- Always run `npm run generate-types` after backend schema changes  
- Do not manually edit files in `src/types/generated/`

### Mobile Responsiveness Requirements
- All new components must work on both mobile and desktop
- Use established breakpoint patterns (`useMediaQuery(theme.breakpoints.down('md'))`)
- Mobile components should be touch-friendly with adequate tap targets

### Error Handling Standards  
- Parse all API errors through `parsePydanticValidationError()` in data provider
- Always provide user-friendly error messages, never expose technical details
- Use consistent error UI patterns from existing components

### Backend API Expectations
- API must be running on `localhost:8082` for development
- API follows FastAPI + Pydantic patterns for error responses
- Authentication via JWT tokens in Authorization header