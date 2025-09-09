/**
 * Rate Limiter Client for InventoScan Frontend
 * Handles rate limit responses and implements retry logic
 */

interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

class RateLimiterClient {
  private rateLimits: Map<string, RateLimitInfo> = new Map();
  private retryQueue: Map<string, Promise<any>> = new Map();
  
  /**
   * Extract rate limit info from response headers
   */
  private extractRateLimitInfo(response: Response): RateLimitInfo | null {
    const limit = response.headers.get('X-RateLimit-Limit');
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');
    const retryAfter = response.headers.get('Retry-After');
    
    if (limit && remaining && reset) {
      return {
        limit: parseInt(limit, 10),
        remaining: parseInt(remaining, 10),
        reset: parseInt(reset, 10),
        retryAfter: retryAfter ? parseInt(retryAfter, 10) : undefined
      };
    }
    
    return null;
  }
  
  /**
   * Get endpoint key from URL
   */
  private getEndpointKey(url: string): string {
    try {
      const urlObj = new URL(url, window.location.origin);
      return `${urlObj.pathname}:${urlObj.searchParams.toString()}`;
    } catch {
      return url;
    }
  }
  
  /**
   * Check if we should preemptively wait based on known limits
   */
  private shouldWaitBeforeRequest(endpoint: string): number {
    const info = this.rateLimits.get(endpoint);
    
    if (!info || info.remaining > 0) {
      return 0;
    }
    
    const now = Math.floor(Date.now() / 1000);
    const waitTime = info.reset - now;
    
    return waitTime > 0 ? waitTime * 1000 : 0;
  }
  
  /**
   * Update rate limit info from response
   */
  private updateRateLimitInfo(endpoint: string, response: Response): void {
    const info = this.extractRateLimitInfo(response);
    if (info) {
      this.rateLimits.set(endpoint, info);
    }
  }
  
  /**
   * Wait for specified milliseconds
   */
  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Show user notification about rate limiting
   */
  private showRateLimitNotification(waitTime: number): void {
    const seconds = Math.ceil(waitTime / 1000);
    const message = `Rate limit erreicht. Bitte warten Sie ${seconds} Sekunden...`;
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'rate-limit-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--bg-card);
      color: var(--text-primary);
      padding: 16px 24px;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-default);
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after wait time
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, waitTime);
  }
  
  /**
   * Fetch with rate limit handling and automatic retry
   */
  async fetchWithRateLimit(
    url: string,
    optionsOrFetcher: RequestInit | ((url: string, options: RequestInit) => Promise<Response>) = {},
    maxRetries: number = 3
  ): Promise<Response> {
    // Check if optionsOrFetcher is a function (custom fetcher) or options object
    const isCustomFetcher = typeof optionsOrFetcher === 'function';
    const options = isCustomFetcher ? {} : optionsOrFetcher;
    const fetcher = isCustomFetcher ? optionsOrFetcher : fetch;
    const endpoint = this.getEndpointKey(url);
    
    // Check if we should wait before making request
    const preWaitTime = this.shouldWaitBeforeRequest(endpoint);
    if (preWaitTime > 0) {
      console.log(`Pre-waiting ${preWaitTime}ms for rate limit`);
      this.showRateLimitNotification(preWaitTime);
      await this.wait(preWaitTime);
    }
    
    // Check if there's already a retry in progress for this endpoint
    const existingRetry = this.retryQueue.get(endpoint);
    if (existingRetry) {
      console.log('Waiting for existing retry to complete');
      return existingRetry;
    }
    
    let retries = 0;
    
    while (retries <= maxRetries) {
      try {
        const response = await fetcher(url, options);
        
        // Update rate limit info from headers
        this.updateRateLimitInfo(endpoint, response);
        
        // Handle rate limit response
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 1000 * Math.pow(2, retries);
          
          if (retries >= maxRetries) {
            throw new Error(`Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`);
          }
          
          console.log(`Rate limited. Waiting ${waitTime}ms before retry ${retries + 1}/${maxRetries}`);
          this.showRateLimitNotification(waitTime);
          
          // Store retry promise to prevent duplicate requests
          const retryPromise = this.wait(waitTime).then(() => 
            this.fetchWithRateLimit(url, optionsOrFetcher, maxRetries - retries - 1)
          );
          
          this.retryQueue.set(endpoint, retryPromise);
          
          try {
            const result = await retryPromise;
            return result;
          } finally {
            this.retryQueue.delete(endpoint);
          }
        }
        
        return response;
      } catch (error) {
        if (retries >= maxRetries) {
          throw error;
        }
        
        // Exponential backoff for other errors
        const waitTime = 1000 * Math.pow(2, retries);
        console.log(`Request failed. Retrying in ${waitTime}ms...`);
        await this.wait(waitTime);
        retries++;
      }
    }
    
    throw new Error('Max retries exceeded');
  }
  
  /**
   * Get current rate limit status for an endpoint
   */
  getRateLimitStatus(endpoint: string): RateLimitInfo | undefined {
    return this.rateLimits.get(endpoint);
  }
  
  /**
   * Clear rate limit cache
   */
  clearCache(): void {
    this.rateLimits.clear();
    this.retryQueue.clear();
  }
}

// Create singleton instance
const rateLimiterClient = new RateLimiterClient();

// Export functions
export const fetchWithRateLimit = (url: string, options?: RequestInit, maxRetries?: number) =>
  rateLimiterClient.fetchWithRateLimit(url, options, maxRetries);

export const getRateLimitStatus = (endpoint: string) =>
  rateLimiterClient.getRateLimitStatus(endpoint);

export const clearRateLimitCache = () =>
  rateLimiterClient.clearCache();

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .rate-limit-notification {
    transition: all 0.3s ease-out;
  }
`;
document.head.appendChild(style);

export default rateLimiterClient;