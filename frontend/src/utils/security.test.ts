import { describe, it, expect } from 'vitest';
import { validateImageUrl, sanitizeProductCode, sanitizeInput } from './security';

describe('URL Validation', () => {
  describe('validateImageUrl', () => {
    it('should allow valid HTTP/HTTPS URLs', () => {
      expect(validateImageUrl('https://example.com/image.jpg')).toBe('https://example.com/image.jpg');
      expect(validateImageUrl('http://localhost:3000/image.png')).toBe('http://localhost:3000/image.png');
    });

    it('should allow local paths', () => {
      expect(validateImageUrl('/uploads/image.jpg')).toBe('/uploads/image.jpg');
      expect(validateImageUrl('./assets/image.png')).toBe('./assets/image.png');
      expect(validateImageUrl('../images/photo.jpg')).toBe('../images/photo.jpg');
    });

    it('should allow blob URLs', () => {
      expect(validateImageUrl('blob:http://localhost:3000/abc-123')).toBe('blob:http://localhost:3000/abc-123');
    });

    it('should allow data URLs for images only', () => {
      expect(validateImageUrl('data:image/jpeg;base64,/9j/4AAQ...')).toBe('data:image/jpeg;base64,/9j/4AAQ...');
      expect(validateImageUrl('data:image/png;base64,iVBORw0KG...')).toBe('data:image/png;base64,iVBORw0KG...');
    });

    it('should block dangerous protocols', () => {
      expect(validateImageUrl('javascript:alert("XSS")')).toBe('/placeholder-image.svg');
      expect(validateImageUrl('data:text/html,<script>alert("XSS")</script>')).toBe('/placeholder-image.svg');
      expect(validateImageUrl('vbscript:msgbox("XSS")')).toBe('/placeholder-image.svg');
      expect(validateImageUrl('file:///etc/passwd')).toBe('/placeholder-image.svg');
      expect(validateImageUrl('chrome://settings')).toBe('/placeholder-image.svg');
    });

    it('should block URLs with XSS attempts', () => {
      expect(validateImageUrl('https://example.com/image.jpg?onclick=alert(1)')).toBe('/placeholder-image.svg');
      expect(validateImageUrl('https://example.com/image.jpg#<script>alert(1)</script>')).toBe('/placeholder-image.svg');
      expect(validateImageUrl('https://example.com/image.jpg%3Cscript%3Ealert(1)%3C%2Fscript%3E')).toBe('/placeholder-image.svg');
    });

    it('should respect domain whitelist when provided', () => {
      const allowedDomains = ['example.com', 'cdn.example.com'];
      
      expect(validateImageUrl('https://example.com/image.jpg', allowedDomains))
        .toBe('https://example.com/image.jpg');
      
      expect(validateImageUrl('https://cdn.example.com/image.jpg', allowedDomains))
        .toBe('https://cdn.example.com/image.jpg');
      
      expect(validateImageUrl('https://evil.com/image.jpg', allowedDomains))
        .toBe('/placeholder-image.svg');
    });

    it('should return placeholder for empty or invalid URLs', () => {
      expect(validateImageUrl('')).toBe('/placeholder-image.svg');
      expect(validateImageUrl('not-a-url')).toBe('/placeholder-image.svg');
      expect(validateImageUrl('ftp://example.com/image.jpg')).toBe('/placeholder-image.svg');
    });
  });

  describe('sanitizeProductCode', () => {
    it('should allow alphanumeric characters and hyphens', () => {
      expect(sanitizeProductCode('PROD-2024-001')).toBe('PROD-2024-001');
      expect(sanitizeProductCode('SKU_12345')).toBe('SKU_12345');
    });

    it('should remove dangerous characters', () => {
      expect(sanitizeProductCode('PROD<script>alert(1)</script>')).toBe('PRODscriptalert1script');
      expect(sanitizeProductCode('SKU-001"; DROP TABLE products;--')).toBe('SKU-001DROPTABLEproducts--');
    });

    it('should handle empty input', () => {
      expect(sanitizeProductCode('')).toBe('');
    });
  });

  describe('sanitizeInput', () => {
    it('should remove all HTML by default', () => {
      expect(sanitizeInput('<script>alert("XSS")</script>Hello')).toBe('Hello');
      expect(sanitizeInput('<b>Bold</b> text')).toBe('Bold text');
    });

    it('should allow safe HTML when specified', () => {
      expect(sanitizeInput('<b>Bold</b> text', true)).toBe('<b>Bold</b> text');
      expect(sanitizeInput('<script>alert(1)</script><b>Bold</b>', true)).toBe('<b>Bold</b>');
    });

    it('should handle empty input', () => {
      expect(sanitizeInput('')).toBe('');
    });
  });
});