from fastapi import FastAPI, Request, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pathlib import Path
import logging
import uvicorn

# Import security middleware and settings
from app.core.security import SecurityHeadersMiddleware
from app.core.config import settings, get_settings
from app.core.rate_limiter import add_rate_limiter_to_app

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create the FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Tender Management System API",
    version=settings.API_VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Add security headers middleware
app.add_middleware(SecurityHeadersMiddleware)

# Set up CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Add rate limiting
add_rate_limiter_to_app(app)

# Import and include API routers
from app.api import api_router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Add exception handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors(), "body": exc.body},
    )

@app.get("/")
async def root():
    return {"message": "Welcome to Tender Management System API"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

# Application startup event
@app.on_event("startup")
async def startup_event():
    """Initialize application services."""
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.API_VERSION}...")

    # Create necessary directories
    settings.UPLOAD_DIR.mkdir(exist_ok=True, parents=True)

# Application shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Clean up resources on shutdown."""
    logger.info("Shutting down API...")
    # Clean up any temporary files or resources
    import shutil
    if settings.UPLOAD_DIR.exists():
        shutil.rmtree(settings.UPLOAD_DIR, ignore_errors=True)

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        workers=1,
    )
