// Security utilities for XSS prevention and input sanitization

/**
 * Sanitize user input to prevent XSS attacks
 * @param input - The input string to sanitize
 * @param allowHtml - Whether to allow HTML tags (default: false)
 * @returns Sanitized string safe for rendering
 */
export const sanitizeInput = (input: string, allowHtml = false): string => {
  if (!input) return '';
  
  if (allowHtml) {
    // For now, just escape HTML until DOMPurify is properly configured
    return escapeHtml(input);
  }
  
  // Remove all HTML tags for plain text
  return escapeHtml(input);
};

/**
 * Basic HTML escaping function
 */
const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns true if email format is valid
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 * @param url - URL to validate
 * @returns true if URL format is valid
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Escape special characters in strings for safe display
 * @param str - String to escape
 * @returns Escaped string
 */
export const escapeString = (str: string): string => {
  if (!str) return '';
  
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate file type for upload
 * @param file - File to validate
 * @param allowedTypes - Array of allowed MIME types
 * @returns true if file type is allowed
 */
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * Validate file size
 * @param file - File to validate
 * @param maxSizeInMB - Maximum allowed size in MB
 * @returns true if file size is within limit
 */
export const validateFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

/**
 * Generate a secure random token
 * @param length - Length of the token
 * @returns Random token string
 */
export const generateToken = (length = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Check if content contains potential XSS patterns
 * @param content - Content to check
 * @returns true if suspicious patterns are found
 */
export const detectXSSPatterns = (content: string): boolean => {
  const xssPatterns = [
    /<script[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[\s\S]*?>/gi,
    /<object[\s\S]*?>/gi,
    /<embed[\s\S]*?>/gi,
    /eval\(/gi,
    /expression\(/gi
  ];
  
  return xssPatterns.some(pattern => pattern.test(content));
};

/**
 * Sanitize file name for safe storage
 * @param fileName - Original file name
 * @returns Sanitized file name
 */
export const sanitizeFileName = (fileName: string): string => {
  // Remove path components and special characters
  return fileName
    .replace(/^.*[\\\/]/, '') // Remove path
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .toLowerCase();
};

/**
 * Rate limiting check
 * @param key - Unique key for the action
 * @param limit - Maximum number of attempts
 * @param windowMs - Time window in milliseconds
 * @returns true if action is allowed
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (key: string, limit: number, windowMs: number): boolean => {
  const now = Date.now();
  const record = rateLimitMap.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs
    });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
};

/**
 * Content Security Policy (CSP) helper
 * @returns CSP header value
 */
export const getCSPHeader = (): string => {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self' http://localhost:* ws://localhost:*",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
};

export default {
  sanitizeInput,
  validateEmail,
  validateUrl,
  escapeString,
  validateFileType,
  validateFileSize,
  generateToken,
  detectXSSPatterns,
  sanitizeFileName,
  checkRateLimit,
  getCSPHeader
};