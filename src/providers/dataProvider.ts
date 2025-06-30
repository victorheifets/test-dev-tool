import { DataProvider } from "@refinedev/core";
import { API_CONFIG, buildApiUrl, getAuthHeaders, ApiError } from "../config/api";

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
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.detail || errorMessage;
      } catch {
        // If not JSON, use the text as message
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API Request failed for ${url}:`, error);
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
      console.error(`[DataProvider] getList error for ${resource}:`, error);
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
      console.error(`[DataProvider] getOne error for ${resource}:${id}:`, error);
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
      console.error(`[DataProvider] create error for ${resource}:`, error);
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
      console.error(`[DataProvider] update error for ${resource}:${id}:`, error);
      throw error;
    }
  },

  // Delete a record
  deleteOne: async ({ resource, id, meta }) => {
    console.log(`[DataProvider] deleteOne called for resource: ${resource}, id: ${id}`);
    
    const apiResource = resourceMap[resource] || resource as keyof typeof API_CONFIG.endpoints;
    const url = buildApiUrl(apiResource, String(id));
    
    try {
      await httpClient(url, {
        method: 'DELETE',
      });
      
      console.log(`[DataProvider] deleteOne success for ${resource}:${id}`);
      return { data: {} };
      
    } catch (error) {
      console.error(`[DataProvider] deleteOne error for ${resource}:${id}:`, error);
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
      console.error(`[DataProvider] custom error:`, error);
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
  
  return {
    ...course,
    // Transform simple price back to pricing object
    pricing: course.price ? {
      amount: course.price,
      currency: 'USD'
    } : undefined,
    // Remove the simple price field
    price: undefined,
  };
}