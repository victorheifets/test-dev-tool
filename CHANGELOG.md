# Changelog

All notable changes to this project will be documented in this file.

## [2025-08-01] - Mobile-Responsive Registration Forms

### Added
- Full-screen mobile modal layout for registration form preview
- Full-screen mobile modal layout for published registration forms
- Mobile-optimized form element sizing (small inputs, large buttons)
- Touch-friendly button layouts with full-width mobile buttons

### Fixed
- Hebrew logout button translation - now displays "התנתק" instead of "Logout"
- Registration form preview now reflects edited values instead of default text
- Registration form publish functionality now uses correct field values
- Text mirroring issues in Hebrew form fields resolved

### Changed
- Replaced problematic description textarea with testField1 for better reliability
- Preview modal now uses `CommonModalShell` with `fullScreen={isMobile}`
- Public registration forms use mobile-first responsive design
- Form state management enhanced to properly sync preview/publish with edits

### Technical Details
- Modified `src/pages/registration-form/index.tsx`:
  - Added `PreviewContentProps` interface for proper state passing
  - Updated preview modal to use `fullScreen={isMobile}` and `showActions={false}`
  - Replaced description field with testField1 throughout component
- Updated `src/pages/registration-form/public.tsx`:
  - Implemented full mobile-first responsive design
  - Added conditional styling for mobile vs desktop layouts
  - Enhanced button layouts for mobile touch interaction
- Fixed `src/components/header/index.tsx`:
  - Added `getLogoutText()` function for direct Hebrew translation
  - Updated logout button and dialog to use proper translation

### Deployment
- Frontend deployed to CloudFront: https://d3ld4gkanad66u.cloudfront.net/
- Backend deployed to AWS Lambda: https://lph40ds6v8.execute-api.eu-west-1.amazonaws.com/prod
- All registration form endpoints tested and working