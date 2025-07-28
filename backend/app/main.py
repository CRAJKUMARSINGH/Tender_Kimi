from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create the FastAPI app
app = FastAPI(
    title="Tender Management API",
    description="API for managing tender documents and processing",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include API routers
from app.api import uploads
app.include_router(uploads.router, prefix="/api/v1", tags=["Tender Processing"])

@app.get("/api/v1/health", tags=["Health"])
async def health_check():
    """Health check endpoint to verify the API is running."""
    return {"status": "ok", "version": app.version}

# Application startup event
@app.on_event("startup")
async def startup_event():
    """Initialize application services."""
    logger.info("Starting Tender Management API...")
    
    # Create necessary directories
    Path("temp_uploads").mkdir(exist_ok=True)

# Application shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Clean up resources on shutdown."""
    logger.info("Shutting down Tender Management API...")
    # Clean up any temporary files or resources
    import shutil
    temp_dir = Path("temp_uploads")
    if temp_dir.exists():
        shutil.rmtree(temp_dir, ignore_errors=True)

# This allows running the app with: uvicorn app.main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
