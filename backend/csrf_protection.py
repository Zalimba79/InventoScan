"""
CSRF Protection for InventoScan API
Implements token generation and validation to prevent Cross-Site Request Forgery attacks
"""

import secrets
import hashlib
import time
from typing import Optional, Dict
from fastapi import HTTPException, Request, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import json

class CSRFProtection:
    """
    CSRF Token Manager
    Generates and validates CSRF tokens for secure API operations
    """
    
    def __init__(self, secret_key: str, token_lifetime: int = 3600):
        """
        Initialize CSRF Protection
        
        Args:
            secret_key: Application secret for token generation
            token_lifetime: Token validity in seconds (default 1 hour)
        """
        self.secret_key = secret_key
        self.token_lifetime = token_lifetime
        self.tokens: Dict[str, float] = {}  # token -> timestamp
        
    def generate_token(self) -> str:
        """
        Generate a new CSRF token
        
        Returns:
            Secure random token string
        """
        # Generate 32 bytes of random data
        token = secrets.token_urlsafe(32)
        
        # Store token with timestamp
        self.tokens[token] = time.time()
        
        # Clean up old tokens
        self._cleanup_expired_tokens()
        
        return token
    
    def validate_token(self, token: str) -> bool:
        """
        Validate a CSRF token
        
        Args:
            token: Token to validate
            
        Returns:
            True if valid, False otherwise
        """
        if not token:
            return False
            
        # Check if token exists
        if token not in self.tokens:
            return False
            
        # Check if token is expired
        token_age = time.time() - self.tokens[token]
        if token_age > self.token_lifetime:
            del self.tokens[token]
            return False
            
        return True
    
    def _cleanup_expired_tokens(self):
        """Remove expired tokens from memory"""
        current_time = time.time()
        expired = [
            token for token, timestamp in self.tokens.items()
            if current_time - timestamp > self.token_lifetime
        ]
        for token in expired:
            del self.tokens[token]


# Middleware for FastAPI
async def csrf_middleware(request: Request, call_next):
    """
    CSRF Middleware for FastAPI
    Validates CSRF tokens on state-changing requests
    """
    # Skip CSRF check for safe methods
    if request.method in ["GET", "HEAD", "OPTIONS"]:
        response = await call_next(request)
        return response
    
    # Skip CSRF for public endpoints
    public_paths = ["/api/csrf-token", "/api/health", "/docs", "/redoc", "/openapi.json"]
    if any(request.url.path.startswith(path) for path in public_paths):
        response = await call_next(request)
        return response
    
    # Get CSRF token from headers
    csrf_token = request.headers.get("X-CSRF-Token")
    
    # Validate token
    if not csrf_token:
        raise HTTPException(
            status_code=403,
            detail="CSRF token missing. Please include X-CSRF-Token header."
        )
    
    # Get CSRF protection instance from app state
    csrf_protection = request.app.state.csrf_protection
    
    if not csrf_protection.validate_token(csrf_token):
        raise HTTPException(
            status_code=403,
            detail="Invalid or expired CSRF token. Please request a new token."
        )
    
    # Token is valid, proceed with request
    response = await call_next(request)
    return response


def create_csrf_endpoint(csrf_protection: CSRFProtection):
    """
    Create endpoint for getting CSRF tokens
    
    Args:
        csrf_protection: CSRFProtection instance
        
    Returns:
        FastAPI route function
    """
    async def get_csrf_token(response: Response):
        """
        Get a new CSRF token
        
        Returns:
            JSON with CSRF token
        """
        token = csrf_protection.generate_token()
        
        # Also set as cookie for convenience
        response.set_cookie(
            key="csrf_token",
            value=token,
            httponly=False,  # Allow JS to read it
            secure=True,     # HTTPS only
            samesite="strict",  # Prevent CSRF
            max_age=3600
        )
        
        return {
            "csrf_token": token,
            "expires_in": csrf_protection.token_lifetime
        }
    
    return get_csrf_token