from typing import Callable, Optional
from functools import wraps
import time
from fastapi import Request, HTTPException, status
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger(__name__)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

def get_rate_limit(rate_limit: str = "100/minute"):
    """
    Decorator to apply rate limiting to a route.

    Args:
        rate_limit: Rate limit string (e.g., "100/minute", "5/second")
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Get the request object (either from args or kwargs)
            request = None
            for arg in args:
                if isinstance(arg, Request):
                    request = arg
                    break
            if not request:
                request = kwargs.get('request')

            if not request:
                logger.warning("Rate limiter could not find request object")
                return await func(*args, **kwargs)

            # Check rate limit
            try:
                return await limiter.check(rate_limit, request)(func)(*args, **kwargs)
            except RateLimitExceeded as e:
                logger.warning(f"Rate limit exceeded for {get_remote_address(request)}")
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail={
                        "error": "Rate limit exceeded",
                        "rate_limit": rate_limit,
                        "message": "Too many requests, please try again later."
                    },
                    headers={"Retry-After": str(e.retry_after)},
                )
        return wrapper
    return decorator

def add_rate_limiter_to_app(app):
    """
    Add rate limiting middleware to the FastAPI app.

    Args:
        app: FastAPI application instance
    """
    # Configure the app to use the rate limiter
    app.state.limiter = limiter

    # Add error handler for rate limit exceeded
    @app.exception_handler(RateLimitExceeded)
    async def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={
                "error": "Rate limit exceeded",
                "message": "Too many requests, please try again later.",
                "retry_after": exc.retry_after
            },
            headers={"Retry-After": str(exc.retry_after)},
        )

    # Add rate limiting middleware
    app.add_middleware(
        SlowAPIMiddleware,
        limiter=limiter
    )
