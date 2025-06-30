⏺ 📝 Exact Instructions 

  # Task: Implement Additional CRUD Resources (Participants, Enrollments, Leads)

  ## Context
  You're working on a React/Refine course management system. The courses CRUD is already
   complete and working. Your job is to replicate this pattern for 3 additional
  resources.

  ## What's Already Done
  - Backend API endpoints exist for all resources at localhost:8083/api/
  - Custom data provider is implemented and working
  - Navigation is configured with placeholder routes
  - Theme system and error handling are complete

  ## Your Task: Create 3 New CRUD Pages

  ### 1. **Participants (Students) Page**
  **File**: `/src/pages/participants/list.tsx`
  **API Resource**: `participants` (maps to `/api/participants`)
  **Navigation Label**: "Students"

  ### 2. **Enrollments Page**
  **File**: `/src/pages/enrollments/list.tsx`
  **API Resource**: `enrollments` (maps to `/api/enrollments`)
  **Navigation Label**: "Enrollments"

  ### 3. **Leads Page**
  **File**: `/src/pages/leads/list.tsx`
  **API Resource**: `leads` (maps to `/api/marketing`)
  **Navigation Label**: "Leads"

  ## Implementation Instructions

  ### Step 1: Copy the Pattern
  - Use `/src/pages/courses/list.tsx` as your template
  - Copy the EXACT structure and replace only the data fields

  ### Step 2: Data Fields for Each Resource

  **Participants Fields:**
  ```typescript
  // Display these columns in DataGrid:
  - name (string)
  - email (string)
  - phone (string)
  - status (string) // active, inactive
  - created_at (date)
  - enrollments_count (number)

  Enrollments Fields:
  // Display these columns in DataGrid:
  - participant_name (string)
  - activity_name (string)
  - status (string) // enrolled, completed, cancelled
  - enrollment_date (date)
  - completion_date (date)
  - payment_status (string)

  Leads Fields:
  // Display these columns in DataGrid:
  - name (string)
  - email (string)
  - phone (string)
  - source (string) // website, referral, social
  - status (string) // new, contacted, qualified, converted
  - created_at (date)

  Step 3: Modify for Each Resource

  1. Change resource name: resource: 'courses' → resource: 'participants'
  2. Update column definitions: Replace course fields with resource-specific fields
  3. Update stat cards: Show relevant metrics for each resource
  4. Update modal component: Create simple create/edit modals
  5. Update page title and breadcrumbs

  Step 4: Create Routes

  Add routes in /src/App.tsx:
  <Route path="/participants" element={<ParticipantsList />} />
  <Route path="/enrollments" element={<EnrollmentsList />} />
  <Route path="/leads" element={<LeadsList />} />

  Step 5: Test Each Page

  - Verify data loads from API
  - Test create/edit/delete operations
  - Ensure error handling works
  - Check responsive design

  Key Requirements

  - Follow exact same pattern as courses page
  - Use existing data provider (already configured)
  - Maintain consistent styling (use same MUI components)
  - Include stat cards at top of each page
  - Add pagination (pageSizeOptions={[5, 10, 25, 50]})
  - Use error handling hook (useErrorHandler)
  - Commit each page separately with clear messages

  Files You Should NOT Touch

  - /src/providers/dataProvider.ts (already working)
  - /src/config/ folder (already configured)
  - /src/utils/ folder (shared utilities)
  - Backend files (Tool A handles those)

  Success Criteria

  ✅ 3 new pages load and display data from API
  ✅ All CRUD operations work (create, edit, delete)
  ✅ Consistent UI/UX with existing courses page✅ No TypeScript errors
  ✅ Clean git commits for each page

  Important Notes

  - The backend API is running on localhost:8083
  - All API endpoints already exist and are functional
  - Use the existing Activity type as reference for creating new types
  - Don't modify the data provider - it handles all resources automatically

  The swagger is on http://localhost:8083/docs
  if not available, use staticSwwager.json in this folder.