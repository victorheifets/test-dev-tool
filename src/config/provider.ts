/**
 * Provider ID configuration for the application
 * This file stores the provider ID for the multi-tenant API
 */

// The provider ID to use for all API requests
export const PROVIDER_ID = '12345678-1234-5678-1234-567812345678';

// Function to get the provider ID (can be extended to get from localStorage, etc.)
export const getProviderId = (): string => {
  return PROVIDER_ID;
}; 