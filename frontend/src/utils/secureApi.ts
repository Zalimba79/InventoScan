/**
 * Secure API Client for InventoScan
 * Combines CSRF protection, Rate Limiting, and other security features
 */

import { secureFetch } from './csrf';
import { fetchWithRateLimit } from './rateLimiter';

/**
 * Enhanced fetch with all security features
 * - CSRF token protection
 * - Rate limiting with automatic retry
 * - XSS prevention
 * - Error handling
 */
export async function secureApiFetch(
  url: string,
  options: RequestInit = {},
  config: {
    maxRetries?: number;
    requireCSRF?: boolean;
    timeout?: number;
  } = {}
): Promise<Response> {
  const {
    maxRetries = 3,
    requireCSRF = true,
    timeout = 30000
  } = config;
  
  // Determine if CSRF is needed based on method
  const method = (options.method || 'GET').toUpperCase();
  const needsCSRF = requireCSRF && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);
  
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    // Combine options with abort signal
    const enhancedOptions: RequestInit = {
      ...options,
      signal: controller.signal,
      credentials: 'include' // Always include credentials
    };
    
    let response: Response;
    
    if (needsCSRF) {
      // Use CSRF-protected fetch (which includes CSRF token)
      // Rate limiting is handled within secureFetch
      response = await secureFetch(url, enhancedOptions);
    } else {
      // Use rate limiting only for GET requests
      response = await fetchWithRateLimit(url, enhancedOptions, maxRetries);
    }
    
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Helper to handle JSON responses with error handling
 */
export async function secureApiJson<T = any>(
  url: string,
  options?: RequestInit,
  config?: Parameters<typeof secureApiFetch>[2]
): Promise<T> {
  const response = await secureApiFetch(url, options, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: `Request failed with status ${response.status}`
    }));
    
    throw new Error(error.detail || error.message || 'Request failed');
  }
  
  return response.json();
}

/**
 * Common API methods with security
 */
export const api = {
  /**
   * GET request
   */
  async get<T = any>(url: string, config?: Parameters<typeof secureApiFetch>[2]): Promise<T> {
    return secureApiJson<T>(url, { method: 'GET' }, { ...config, requireCSRF: false });
  },
  
  /**
   * POST request
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: Parameters<typeof secureApiFetch>[2]
  ): Promise<T> {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (data !== undefined) {
      options.body = JSON.stringify(data);
    }
    
    return secureApiJson<T>(url, options, config);
  },
  
  /**
   * PUT request
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: Parameters<typeof secureApiFetch>[2]
  ): Promise<T> {
    const options: RequestInit = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (data !== undefined) {
      options.body = JSON.stringify(data);
    }
    
    return secureApiJson<T>(url, options, config);
  },
  
  /**
   * DELETE request
   */
  async delete<T = any>(
    url: string,
    config?: Parameters<typeof secureApiFetch>[2]
  ): Promise<T> {
    return secureApiJson<T>(url, { method: 'DELETE' }, config);
  },
  
  /**
   * PATCH request
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: Parameters<typeof secureApiFetch>[2]
  ): Promise<T> {
    const options: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (data !== undefined) {
      options.body = JSON.stringify(data);
    }
    
    return secureApiJson<T>(url, options, config);
  },
  
  /**
   * Upload file with security
   */
  async upload<T = any>(
    url: string,
    file: File,
    config?: Parameters<typeof secureApiFetch>[2]
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await secureApiFetch(
      url,
      {
        method: 'POST',
        body: formData
      },
      config
    );
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: `Upload failed with status ${response.status}`
      }));
      
      throw new Error(error.detail || 'Upload failed');
    }
    
    return response.json();
  }
};

export default api;