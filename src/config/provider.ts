/**
 * Provider ID configuration for the application
 * This file stores the provider ID for the multi-tenant API
 */

// The provider ID to use for all API requests (matches existing provider in database)
export const PROVIDER_ID = 'ffa6c96f-e4a2-4df2-8298-415daa45d23c';

// Function to get the provider ID (can be extended to get from localStorage, etc.)
export const getProviderId = (): string => {
  return PROVIDER_ID;
}; 