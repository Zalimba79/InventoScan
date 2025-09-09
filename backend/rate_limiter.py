"""
Rate Limiting for InventoScan API
Prevents DoS attacks and resource abuse
"""

import time
import hashlib
from typing import Dict, Optional, Tuple
from collections import defaultdict
from fastapi import HTTPException, Request, Response
from fastapi.responses import JSONResponse
import json

class RateLimiter:
    """
    Token Bucket Rate Limiter
    Implements a token bucket algorithm for flexible rate limiting
    """
    
    def __init__(self):
        # Store rate limit data: {client_id: {endpoint: (tokens, last_refill)}}
        self.buckets: Dict[str, Dict[str, Tuple[float, float]]] = defaultdict(dict)
        
        # Configuration for different endpoint types
        self.limits = {
            # Endpoint pattern: (max_tokens, refill_rate_per_second, burst_size)
            'default': (60, 1.0, 60),           # 60 requests/minute
            'auth': (5, 0.083, 5),              # 5 requests/minute for auth
            'upload': (20, 0.333, 20),          # 20 uploads/minute
            'delete': (10, 0.167, 10),          # 10 deletes/minute
            'update': (30, 0.5, 30),            # 30 updates/minute
            'analyze': (5, 0.083, 5),           # 5 AI analyses/minute
            'export': (10, 0.167, 10),          # 10 exports/minute
            'read': (100, 1.667, 100),          # 100 reads/minute
        }
        
    def get_client_id(self, request: Request) -> str:
        """
        Get unique client identifier from request
        Uses IP address and user agent for identification
        """
        # Get real IP (considering proxy headers)
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            ip = forwarded_for.split(",")[0].strip()
        else:
            ip = request.client.host if request.client else "unknown"
        
        # Combine with user agent for better identification
        user_agent = request.headers.get("User-Agent", "")
        client_string = f"{ip}:{user_agent}"
        
        # Hash for privacy
        return hashlib.sha256(client_string.encode()).hexdigest()[:16]
    
    def get_endpoint_type(self, path: str, method: str) -> str:
        """
        Determine endpoint type based on path and method
        """
        path_lower = path.lower()
        
        # Auth endpoints
        if 'login' in path_lower or 'register' in path_lower or 'auth' in path_lower:
            return 'auth'
        
        # Upload endpoints
        if 'upload' in path_lower and method == 'POST':
            return 'upload'
        
        # Delete endpoints
        if method == 'DELETE':
            return 'delete'
        
        # Update endpoints
        if method in ['PUT', 'PATCH']:
            return 'update'
        
        # AI/Analysis endpoints
        if 'analyze' in path_lower or 'ai' in path_lower:
            return 'analyze'
        
        # Export endpoints
        if 'export' in path_lower or 'download' in path_lower:
            return 'export'
        
        # Read endpoints
        if method == 'GET':
            return 'read'
        
        return 'default'
    
    def check_rate_limit(
        self, 
        client_id: str, 
        endpoint_type: str
    ) -> Tuple[bool, int, int]:
        """
        Check if request is within rate limit
        
        Returns:
            (allowed, remaining_tokens, reset_time)
        """
        current_time = time.time()
        max_tokens, refill_rate, burst_size = self.limits.get(
            endpoint_type, 
            self.limits['default']
        )
        
        # Get or initialize bucket for this client/endpoint
        bucket_key = f"{client_id}:{endpoint_type}"
        
        if bucket_key not in self.buckets:
            # Initialize new bucket with full tokens
            self.buckets[bucket_key] = {
                'tokens': max_tokens,
                'last_refill': current_time
            }
        
        bucket = self.buckets[bucket_key]
        
        # Calculate tokens to add based on time passed
        time_passed = current_time - bucket['last_refill']
        tokens_to_add = time_passed * refill_rate
        
        # Refill bucket (up to burst size)
        bucket['tokens'] = min(burst_size, bucket['tokens'] + tokens_to_add)
        bucket['last_refill'] = current_time
        
        # Check if we have tokens available
        if bucket['tokens'] >= 1:
            bucket['tokens'] -= 1
            remaining = int(bucket['tokens'])
            reset_time = int(current_time + (1 / refill_rate))
            return True, remaining, reset_time
        
        # Calculate when tokens will be available
        tokens_needed = 1 - bucket['tokens']
        wait_time = tokens_needed / refill_rate
        reset_time = int(current_time + wait_time)
        
        return False, 0, reset_time
    
    def cleanup_old_buckets(self, max_age: int = 3600):
        """
        Remove old buckets to prevent memory leak
        """
        current_time = time.time()
        keys_to_remove = []
        
        for key, bucket in self.buckets.items():
            if current_time - bucket['last_refill'] > max_age:
                keys_to_remove.append(key)
        
        for key in keys_to_remove:
            del self.buckets[key]


# Global rate limiter instance
rate_limiter = RateLimiter()


async def rate_limit_middleware(request: Request, call_next):
    """
    FastAPI middleware for rate limiting
    """
    # Skip rate limiting for health checks and static files
    skip_paths = ['/api/health', '/docs', '/redoc', '/openapi.json', '/favicon.ico']
    if any(request.url.path.startswith(path) for path in skip_paths):
        return await call_next(request)
    
    # Get client ID and endpoint type
    client_id = rate_limiter.get_client_id(request)
    endpoint_type = rate_limiter.get_endpoint_type(request.url.path, request.method)
    
    # Check rate limit
    allowed, remaining, reset_time = rate_limiter.check_rate_limit(client_id, endpoint_type)
    
    if not allowed:
        # Return 429 Too Many Requests
        response = JSONResponse(
            status_code=429,
            content={
                "detail": "Rate limit exceeded. Please wait before making another request.",
                "retry_after": reset_time - int(time.time())
            },
            headers={
                "X-RateLimit-Limit": str(rate_limiter.limits[endpoint_type][0]),
                "X-RateLimit-Remaining": "0",
                "X-RateLimit-Reset": str(reset_time),
                "Retry-After": str(reset_time - int(time.time()))
            }
        )
        return response
    
    # Process request
    response = await call_next(request)
    
    # Add rate limit headers to response
    response.headers["X-RateLimit-Limit"] = str(rate_limiter.limits[endpoint_type][0])
    response.headers["X-RateLimit-Remaining"] = str(remaining)
    response.headers["X-RateLimit-Reset"] = str(reset_time)
    
    # Periodic cleanup (1% chance per request)
    import random
    if random.random() < 0.01:
        rate_limiter.cleanup_old_buckets()
    
    return response


def create_rate_limit_decorator(
    max_calls: int = 10,
    time_window: int = 60,
    endpoint_type: Optional[str] = None
):
    """
    Decorator for rate limiting specific endpoints
    
    Usage:
        @app.post("/api/expensive-operation")
        @rate_limit(max_calls=5, time_window=60)
        async def expensive_operation():
            ...
    """
    def decorator(func):
        async def wrapper(request: Request, *args, **kwargs):
            client_id = rate_limiter.get_client_id(request)
            
            # Use custom limits if provided
            if endpoint_type:
                old_limit = rate_limiter.limits.get(endpoint_type)
                rate_limiter.limits[endpoint_type] = (
                    max_calls,
                    max_calls / time_window,
                    max_calls
                )
            
            # Check rate limit
            allowed, remaining, reset_time = rate_limiter.check_rate_limit(
                client_id,
                endpoint_type or 'default'
            )
            
            # Restore old limit if custom was used
            if endpoint_type and old_limit:
                rate_limiter.limits[endpoint_type] = old_limit
            
            if not allowed:
                raise HTTPException(
                    status_code=429,
                    detail="Rate limit exceeded",
                    headers={
                        "X-RateLimit-Remaining": "0",
                        "X-RateLimit-Reset": str(reset_time),
                        "Retry-After": str(reset_time - int(time.time()))
                    }
                )
            
            return await func(request, *args, **kwargs)
        
        return wrapper
    return decorator


# Convenience decorators for common limits
rate_limit = create_rate_limit_decorator
strict_limit = lambda: create_rate_limit_decorator(max_calls=5, time_window=60)
moderate_limit = lambda: create_rate_limit_decorator(max_calls=30, time_window=60)
relaxed_limit = lambda: create_rate_limit_decorator(max_calls=100, time_window=60)