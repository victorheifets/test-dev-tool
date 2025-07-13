// Auto-generated default values
// DO NOT EDIT MANUALLY - Generated from OpenAPI spec

// Entity defaults
export const EntityDefaults = {
  activity: {
    status: "draft" as const,
    type: "course" as const,
    currency: "USD",
    capacity: 20,
    featured: false,
    is_active: true,
  },
  
  participant: {
    is_active: true,
  },
  
  enrollment: {
    status: "pending" as const,
    completion_percentage: 0,
    is_active: true,
  },
  
  lead: {
    status: "new" as const,
    source: "website" as const,
    is_active: true,
  },
  
  provider: {
    currency: "USD",
    is_active: true,
  },
} as const;

// UI defaults (not sent to server)
export const UIDefaults = {
  pagination: {
    limit: 50,
    cursor: null,
  },
  
  forms: {
    activity: {
      capacity: 20,
      price: 0,
    },
  },
} as const;

export type EntityDefaultsType = typeof EntityDefaults;
export type UIDefaultsType = typeof UIDefaults;
