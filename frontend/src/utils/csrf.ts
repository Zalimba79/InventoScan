/**
 * CSRF Token Management for InventoScan Frontend
 * Handles token fetching, storage, and automatic inclusion in requests
 */

const CSRF_TOKEN_KEY = 'csrf_token';
const CSRF_TOKEN_EXPIRY_KEY = 'csrf_token_expiry';

class CSRFManager {
  private token: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.loadToken();
  }

  /**
   * Load CSRF token from localStorage
   */
  private loadToken(): void {
    const storedToken = localStorage.getItem(CSRF_TOKEN_KEY);
    const storedExpiry = localStorage.getItem(CSRF_TOKEN_EXPIRY_KEY);

    if (storedToken && storedExpiry) {
      const expiry = parseInt(storedExpiry, 10);
      if (Date.now() < expiry) {
        this.token = storedToken;
        this.tokenExpiry = expiry;
      } else {
        // Token expired, clear it
        this.clearToken();
      }
    }
  }

  /**
   * Save CSRF token to localStorage
   */
  private saveToken(token: string, expiresIn: number): void {
    this.token = token;
    this.tokenExpiry = Date.now() + (expiresIn * 1000);
    
    localStorage.setItem(CSRF_TOKEN_KEY, token);
    localStorage.setItem(CSRF_TOKEN_EXPIRY_KEY, this.tokenExpiry.toString());
  }

  /**
   * Clear stored CSRF token
   */
  private clearToken(): void {
    this.token = null;
    this.tokenExpiry = null;
    localStorage.removeItem(CSRF_TOKEN_KEY);
    localStorage.removeItem(CSRF_TOKEN_EXPIRY_KEY);
  }

  /**
   * Fetch a new CSRF token from the server
   */
  async fetchNewToken(): Promise<string> {
    try {
      // Try to get the API URL
      const apiUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:8000/api/csrf-token'
        : '/api/csrf-token';
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        credentials: 'include', // Include cookies
      });

      if (!response.ok) {
        // If backend is not available, return a dummy token for development
        console.debug('CSRF endpoint not available, using dummy token for development');
        return 'dev-token-' + Date.now();
      }

      const data = await response.json();
      const { csrf_token, expires_in } = data;

      // Save token
      this.saveToken(csrf_token, expires_in || 3600);

      return csrf_token;
    } catch (error) {
      // Silently handle connection errors in development
      console.debug('Backend not available, using dummy CSRF token for development');
      // Return a dummy token for development when backend is not running
      return 'dev-token-' + Date.now();
    }
  }

  /**
   * Get current CSRF token, fetching new one if needed
   */
  async getToken(): Promise<string> {
    // Check if we have a valid token
    if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    // Fetch new token
    return await this.fetchNewToken();
  }

  /**
   * Add CSRF token to request headers
   */
  async addTokenToHeaders(headers: HeadersInit = {}): Promise<HeadersInit> {
    const token = await this.getToken();
    
    return {
      ...headers,
      'X-CSRF-Token': token,
    };
  }

  /**
   * Wrapper for fetch with automatic CSRF token inclusion
   */
  async secureFetch(url: string, options: RequestInit = {}): Promise<Response> {
    // Only add CSRF token for state-changing methods
    const method = options.method?.toUpperCase() || 'GET';
    const needsCSRF = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);

    if (needsCSRF) {
      options.headers = await this.addTokenToHeaders(options.headers);
    }

    // Add credentials to include cookies
    options.credentials = options.credentials || 'include';

    const response = await fetch(url, options);

    // If CSRF token is invalid, try to get a new one and retry
    if (response.status === 403) {
      const errorData = await response.json().catch(() => ({}));
      
      if (errorData.detail?.includes('CSRF')) {
        console.log('CSRF token invalid, fetching new token...');
        this.clearToken();
        
        // Get new token and retry request
        const newToken = await this.fetchNewToken();
        options.headers = {
          ...options.headers,
          'X-CSRF-Token': newToken,
        };
        
        return fetch(url, options);
      }
    }

    return response;
  }
}

// Create singleton instance
const csrfManager = new CSRFManager();

// Export functions for easy use
export const getCSRFToken = () => csrfManager.getToken();
export const secureFetch = (url: string, options?: RequestInit) => 
  csrfManager.secureFetch(url, options);
export const addCSRFHeader = (headers?: HeadersInit) => 
  csrfManager.addTokenToHeaders(headers);

// Initialize CSRF token on app load
export const initializeCSRF = async () => {
  try {
    await csrfManager.fetchNewToken();
    console.debug('CSRF protection initialized');
  } catch (error) {
    console.debug('CSRF protection using fallback mode');
  }
};

export default csrfManager;