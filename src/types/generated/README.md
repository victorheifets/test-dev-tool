# Generated Types and Validation

This directory contains auto-generated TypeScript types and Zod validation schemas from the Course Management API OpenAPI specification.

## Files

- `api-types.ts` - TypeScript type definitions generated from OpenAPI
- `validation-schemas.ts` - Zod validation schemas for runtime validation
- `defaults.ts` - Default values for entities and UI components
- `index.ts` - Clean exports for all generated types

## Usage

```typescript
import { 
  ActivityCreateSchema, 
  ActivityCreate,
  EntityDefaults 
} from '@/types/generated';

// Validate form data
const formData = ActivityCreateSchema.parse(userInput);

// Use defaults
const newActivity = {
  ...EntityDefaults.activity,
  ...formData
};
```

## Regeneration

To regenerate these files, run:

```bash
cd course-management-api
python scripts/generate_client_types.py
```

**⚠️ DO NOT EDIT THESE FILES MANUALLY**

These files are automatically generated from the backend API schemas. Any manual changes will be overwritten.

To modify validation rules or types:
1. Update the backend Pydantic schemas
2. Regenerate these files using the script above
