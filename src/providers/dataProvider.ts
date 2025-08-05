import { DataProvider } from "@refinedev/core";
import { API_CONFIG, buildApiUrl, getAuthHeaders } from "../config/api";
import { AppError, logError, parseError } from "../utils/errorHandler";

/**
 * Custom Data Provider for Course Management API
 * Implements Refine DataProvider interface to work with backend API
 */

/**
 * Parse Pydantic validation errors to extract user-friendly messages
 * Input: "1 validation error for ParticipantCreate\nphone\n  Value error, Phone number must be at least 10 digits [type=value_error, input_value='34434334', input_type=str]"
 * Output: "Phone number must be at least 10 digits"
 */
const parsePydanticValidationError = (message: string): string | null => {
  try {
    // Handle single-line format: "1 validation error for ParticipantCreate phone Value error, Phone number must be at least 10 digits [type=value_error...]"
    if (message.includes('Value error,')) {
      const match = message.match(/Value error,\s*(.+?)(?:\s*\[|$)/);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    // Handle multiline format - split by lines and find the actual error message
    const lines = message.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Skip empty lines and technical headers
      if (!trimmed || trimmed.includes('validation error for')) {
        continue;
      }
      
      // Look for "Value error," in multiline format
      if (trimmed.includes('Value error,')) {
        const match = trimmed.match(/Value error,\s*(.+?)(?:\s*\[|$)/);
        if (match && match[1]) {
          return match[1].trim();
        }
      }
      
      // Look for other common Pydantic error patterns
      if (trimmed.includes('String should have at least') || 
          trimmed.includes('Input should be') ||
          trimmed.includes('Field required') ||
          trimmed.includes('Invalid email')) {
        // Clean up technical details
        return trimmed.replace(/\s*\[.*?\].*$/, '').trim();
      }
      
      // For field-specific messages, extract clean text (multiline format)
      if (trimmed.length > 10 && 
          !trimmed.includes('For further information') &&
          !trimmed.includes('[type=')) {
        const cleanMessage = trimmed.replace(/\s*\[.*?\].*$/, '').trim();
        if (cleanMessage && cleanMessage.length > 5) {
          return cleanMessage;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to parse Pydantic error:', error);
    return null;
  }
};

// HTTP Client with error handling
const httpClient = async (url: string, options: RequestInit = {}): Promise<any> => {
  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  // console.log(`[httpClient] Making request to: ${url}`);
  // console.log(`[httpClient] Headers:`, config.headers);
  // console.log(`[httpClient] Method:`, config.method || 'GET');
  // if (config.body) console.log(`[httpClient] Body:`, config.body);

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
        
        // Handle new standardized error format
        if (errorJson.error && errorJson.message) {
          errorMessage = errorJson.message;
          
          // Parse Pydantic validation errors for better user experience
          if (errorJson.error_code === 'VALIDATION_ERROR' && errorMessage.includes('validation error')) {
            const cleanMessage = parsePydanticValidationError(errorMessage);
            if (cleanMessage) {
              errorMessage = cleanMessage;
            }
          }
          
          // Handle details array if present (for other error types)
          if (errorJson.details && Array.isArray(errorJson.details) && errorJson.details.length > 0) {
            errorMessage += ': ' + errorJson.details.map((d: any) => d.message).join(', ');
          }
        } else {
          // Fallback to old format
          errorMessage = errorJson.message || errorJson.detail || errorMessage;
        }
        errorCode = errorJson.code || errorCode;
      } catch {
        // If not JSON, use the text as message
        errorMessage = errorText || errorMessage;
      }
      
      throw new AppError(errorMessage, response.status, errorCode);
    }
    
    // Check if response has content to parse
    const contentType = response.headers.get('content-type');
    const hasJsonContent = contentType && contentType.includes('application/json');
    
    // For successful DELETE operations or empty responses, return empty object
    if (response.status === 204 || !hasJsonContent) {
      return {};
    }
    
    // Try to parse JSON, but handle empty responses gracefully
    const text = await response.text();
    if (!text.trim()) {
      return {};
    }
    
    const data = JSON.parse(text);
    
    // Handle new standardized success response format
    if (data.success !== undefined) {
      return data.data || data;
    }
    
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
  'instructors': 'instructors',
  'sms': 'sms',
  'sms/history': 'sms',
  'registration-forms': 'registration-forms'
};

export const dataProvider: DataProvider = {
  // Get a list of records
  getList: async ({ resource, pagination, sorters, filters, meta }) => {
    console.log(`[DataProvider] getList called for resource: ${resource}`);
    
    const apiResource = resourceMap[resource] || resource as keyof typeof API_CONFIG.endpoints;
    const url = buildApiUrl(apiResource);
    
    // Build query parameters
    const params = new URLSearchParams();
    
    if (pagination && pagination.current && pagination.pageSize) {
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
    
    // console.log(`[DataProvider] Full URL: ${fullUrl}`);
    // console.log(`[DataProvider] API Resource: ${apiResource}`);
    // console.log(`[DataProvider] Resource Map Result: ${resourceMap[resource]}`);
    
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
  create: async ({ resource, variables, meta, successNotification, errorNotification }) => {
    console.log(`[DataProvider] create called for resource: ${resource}`, variables);
    
    const apiResource = resourceMap[resource] || resource as keyof typeof API_CONFIG.endpoints;
    const url = buildApiUrl(apiResource);
    
    // Transform data if needed
    let payload = variables;
    if (resource === 'courses') {
      payload = transformCourseToActivity(variables);
    }
    
    // Provider ID will be handled via JWT token in headers
    // No need to manually add provider_id to payload
    
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
      console.log('Payload keys:', Object.keys(payload as object));
      console.log('=============================================\n');
    }
    
    // Handle flexible enrollment endpoint for enrollments with participant creation or lead conversion
    let finalUrl = url;
    if (resource === 'enrollments' && payload.mode && (payload.participant_data || payload.lead_id)) {
      finalUrl = url + '/enroll-flexible';
      console.log('[DataProvider] Using flexible enrollment endpoint:', finalUrl);
    }
    
    try {
      const response = await httpClient(finalUrl, {
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
    
    // Provider ID will be handled via JWT token in headers
    // No need to manually add provider_id to payload
    
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
      return { data: { id } as any };
      
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
    console.log(`[DataProvider] custom called:`, { url, method, payload });
    
    const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.baseURL}${url}`;
    console.log(`[DataProvider] Full URL: ${fullUrl}`);
    
    const config: RequestInit = {
      method: method?.toUpperCase() || 'GET',
      headers: {
        ...getAuthHeaders(),
        ...headers,
      },
    };
    
    if (payload) {
      config.body = JSON.stringify(payload);
      console.log(`[DataProvider] Payload:`, JSON.stringify(payload, null, 2));
    }
    
    try {
      console.log(`[DataProvider] Making request to: ${fullUrl}`);
      const response = await httpClient(fullUrl, config);
      console.log(`[DataProvider] custom success - Response:`, response);
      return { data: response };
      
    } catch (error) {
      console.error(`[DataProvider] custom failed:`, error);
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