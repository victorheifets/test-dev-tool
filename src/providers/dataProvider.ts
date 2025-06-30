import { DataProvider } from "@refinedev/core";
import { API_CONFIG, buildApiUrl, getAuthHeaders } from "../config/api";
import { AppError, logError, parseError } from "../utils/errorHandler";

/**
 * Custom Data Provider for Course Management API
 * Implements Refine DataProvider interface to work with backend API
 */

// HTTP Client with error handling
const httpClient = async (url: string, options: RequestInit = {}): Promise<any> => {
  const config: RequestInit = {
    headers: getAuthHeaders(),
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error Response (${response.status}):`, errorText);
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorCode = 'API_ERROR';
      
      try {
        const errorJson = JSON.parse(errorText);
        console.error('Parsed error details:', errorJson);
        errorMessage = errorJson.message || errorJson.detail || errorMessage;
        errorCode = errorJson.code || errorCode;
      } catch {
        // If not JSON, use the text as message
        errorMessage = errorText || errorMessage;
      }
      
      throw new AppError(errorMessage, response.status, errorCode);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    logError(error, `HTTP Request: ${url}`);
    throw error;
  }
};

// Resource name mapping (frontend names to API endpoints)
const resourceMap: Record<string, keyof typeof API_CONFIG.endpoints> = {
  'courses': 'activities',
  'activities': 'activities', 
  'participants': 'participants',
  'students': 'participants',
  'enrollments': 'enrollments',
  'leads': 'marketing',
  'marketing': 'marketing',
  'instructors': 'instructors'
};

export const dataProvider: DataProvider = {
  // Get a list of records
  getList: async ({ resource, pagination, sorters, filters, meta }) => {
    console.log(`[DataProvider] getList called for resource: ${resource}`);
    
    const apiResource = resourceMap[resource] || resource as keyof typeof API_CONFIG.endpoints;
    const url = buildApiUrl(apiResource);
    
    // Build query parameters
    const params = new URLSearchParams();
    
    if (pagination) {
      params.append('skip', String((pagination.current - 1) * pagination.pageSize));
      params.append('limit', String(pagination.pageSize));
    }
    
    if (sorters && sorters.length > 0) {
      const sorter = sorters[0];
      params.append('sort_by', sorter.field);
      params.append('sort_order', sorter.order);
    }
    
    // Add filters as query parameters
    if (filters && filters.length > 0) {
      filters.forEach(filter => {
        if (filter.operator === 'eq' && filter.value !== undefined) {
          params.append(filter.field, String(filter.value));
        }
      });
    }
    
    const fullUrl = params.toString() ? `${url}?${params.toString()}` : url;
    
    try {
      const response = await httpClient(fullUrl);
      
      // Handle different response formats from backend
      let data, total;
      
      if (Array.isArray(response)) {
        // Direct array response
        data = response;
        total = response.length;
      } else if (response.items && Array.isArray(response.items)) {
        // Paginated response with items array
        data = response.items;
        total = response.total || response.items.length;
      } else if (response.data && Array.isArray(response.data)) {
        // Wrapped in data property
        data = response.data;
        total = response.total || response.data.length;
      } else {
        // Fallback
        data = response;
        total = Array.isArray(response) ? response.length : 1;
      }
      
      // Transform data if needed (e.g., activities to courses)
      if (resource === 'courses' && Array.isArray(data)) {
        data = data.map(transformActivityToCourse);
      }
      
      console.log(`[DataProvider] getList success: ${data.length} items`);
      return { data, total };
      
    } catch (error) {
      logError(error, `DataProvider.getList(${resource})`);
      throw error;
    }
  },

  // Get a single record
  getOne: async ({ resource, id, meta }) => {
    console.log(`[DataProvider] getOne called for resource: ${resource}, id: ${id}`);
    
    const apiResource = resourceMap[resource] || resource as keyof typeof API_CONFIG.endpoints;
    const url = buildApiUrl(apiResource, String(id));
    
    try {
      const response = await httpClient(url);
      let data = response.data || response;
      
      // Transform data if needed
      if (resource === 'courses') {
        data = transformActivityToCourse(data);
      }
      
      console.log(`[DataProvider] getOne success for ${resource}:${id}`);
      return { data };
      
    } catch (error) {
      logError(error, `DataProvider.getOne(${resource}:${id})`);
      throw error;
    }
  },

  // Create a new record
  create: async ({ resource, variables, meta }) => {
    console.log(`[DataProvider] create called for resource: ${resource}`, variables);
    
    const apiResource = resourceMap[resource] || resource as keyof typeof API_CONFIG.endpoints;
    const url = buildApiUrl(apiResource);
    
    // Transform data if needed
    let payload = variables;
    if (resource === 'courses') {
      payload = transformCourseToActivity(variables);
    }
    
    // Add provider_id to payload if not present
    if (!payload.provider_id) {
      payload.provider_id = API_CONFIG.defaultProviderId;
    }
    
    console.log('Final payload being sent to API:', JSON.stringify(payload, null, 2));
    console.log(`[DataProvider] Sending POST request to: ${url}`);
    
    // Extra debugging for enrollment creation
    if (resource === 'enrollments') {
      console.log('\n=== ENROLLMENT CREATE DEBUG - Frontend ===');
      console.log('Resource:', resource);
      console.log('API Resource:', apiResource);
      console.log('URL:', url);
      console.log('Original variables:', JSON.stringify(variables, null, 2));
      console.log('Final payload:', JSON.stringify(payload, null, 2));
      console.log('Payload keys:', Object.keys(payload));
      console.log('=============================================\n');
    }
    
    try {
      const response = await httpClient(url, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      
      let data = response.data || response;
      
      // Transform response back if needed
      if (resource === 'courses') {
        data = transformActivityToCourse(data);
      }
      
      console.log(`[DataProvider] create success for ${resource}`);
      return { data };
      
    } catch (error) {
      logError(error, `DataProvider.create(${resource})`);
      throw error;
    }
  },

  // Update a record
  update: async ({ resource, id, variables, meta }) => {
    console.log(`[DataProvider] update called for resource: ${resource}, id: ${id}`, variables);
    
    const apiResource = resourceMap[resource] || resource as keyof typeof API_CONFIG.endpoints;
    const url = buildApiUrl(apiResource, String(id));
    
    // Transform data if needed
    let payload = variables;
    if (resource === 'courses') {
      payload = transformCourseToActivity(variables);
    }
    
    // Add provider_id to payload if not present (for updates too)
    if (!payload.provider_id) {
      payload.provider_id = API_CONFIG.defaultProviderId;
    }
    
    try {
      const response = await httpClient(url, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      
      let data = response.data || response;
      
      // Transform response back if needed
      if (resource === 'courses') {
        data = transformActivityToCourse(data);
      }
      
      console.log(`[DataProvider] update success for ${resource}:${id}`);
      return { data };
      
    } catch (error) {
      logError(error, `DataProvider.update(${resource}:${id})`);
      throw error;
    }
  },

  // Delete a record
  deleteOne: async ({ resource, id, meta }) => {
    console.log(`[DataProvider] deleteOne called for resource: ${resource}, id: ${id}`);
    
    const apiResource = resourceMap[resource] || resource as keyof typeof API_CONFIG.endpoints;
    const url = buildApiUrl(apiResource, String(id));
    
    console.log(`[DataProvider] DELETE request to: ${url}`);
    
    try {
      const response = await httpClient(url, {
        method: 'DELETE',
      });
      
      console.log(`[DataProvider] deleteOne success for ${resource}:${id}`, response);
      return { data: {} };
      
    } catch (error) {
      console.error(`[DataProvider] deleteOne failed for ${resource}:${id}`, error);
      logError(error, `DataProvider.deleteOne(${resource}:${id})`);
      throw error;
    }
  },

  // Get API URL for a resource
  getApiUrl: () => API_CONFIG.baseURL,
  
  // Custom method for additional functionality
  custom: async ({ url, method, filters, sorters, payload, query, headers, meta }) => {
    console.log(`[DataProvider] custom called:`, { url, method });
    
    const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.baseURL}${url}`;
    
    const config: RequestInit = {
      method: method?.toUpperCase() || 'GET',
      headers: {
        ...getAuthHeaders(),
        ...headers,
      },
    };
    
    if (payload) {
      config.body = JSON.stringify(payload);
    }
    
    try {
      const response = await httpClient(fullUrl, config);
      console.log(`[DataProvider] custom success`);
      return { data: response };
      
    } catch (error) {
      logError(error, `DataProvider.custom(${method} ${url})`);
      throw error;
    }
  },
};

// Helper functions to transform data between frontend and backend formats

function transformActivityToCourse(activity: any): any {
  if (!activity) return activity;
  
  return {
    ...activity,
    // Map complex pricing to simple price for display
    price: activity.pricing?.amount || 0,
    // Ensure dates are properly formatted
    start_date: activity.start_date,
    end_date: activity.end_date,
  };
}

function transformCourseToActivity(course: any): any {
  if (!course) return course;
  
  const transformed = {
    ...course,
    // Ensure proper data types
    capacity: Number(course.capacity) || 0,
    // Transform simple price back to pricing object
    pricing: course.price ? {
      amount: Number(course.price) || 0,
      currency: 'USD'
    } : {
      amount: Number(course.pricing?.amount) || 0,
      currency: course.pricing?.currency || 'USD'
    },
  };
  
  // Remove the simple price field completely (don't send undefined)
  delete transformed.price;
  
  // Clean up undefined values that might cause API issues  
  Object.keys(transformed).forEach(key => {
    if (transformed[key] === undefined) {
      delete transformed[key];
    }
  });
  
  return transformed;
}