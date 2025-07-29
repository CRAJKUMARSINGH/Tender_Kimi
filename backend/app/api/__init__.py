"""
API package for the Tender Management System.

This package contains all the API endpoints for the application.
"""
from fastapi import APIRouter

from app.api.v1 import uploads, bidders, reports

# Create main API router
api_router = APIRouter()

# Include API version 1 routers
api_router.include_router(uploads.router, prefix="/uploads", tags=["File Uploads"])
api_router.include_router(bidders.router, prefix="/bidders", tags=["Bidder Management"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
