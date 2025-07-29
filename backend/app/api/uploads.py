from fastapi import APIRouter, UploadFile, File, HTTPException, status
from fastapi.responses import JSONResponse
from typing import List, Dict, Any
import os
import shutil
from pathlib import Path
from datetime import datetime
import pandas as pd
import asyncio

from app.core.config import settings
from app.services.excel_parser import parse_excel

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {"xlsx", "xls"}

def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@router.post("/upload", response_model=Dict[str, Any])
async def upload_file(file: UploadFile = File(...)):
    """
    Handle file upload and validation
    """
    # Validate file type
    if not allowed_file(file.filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Validate file size (5MB max)
    max_size = settings.MAX_UPLOAD_SIZE
    file.file.seek(0, 2)  # Go to end of file
    file_size = file.file.tell()
    file.file.seek(0)  # Reset file pointer

    if file_size > max_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Maximum size is {max_size} bytes"
        )

    # Save the file temporarily
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_{file.filename}"
    file_path = UPLOAD_DIR / filename

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Process the file asynchronously
        result = await parse_excel(file_path)

        # Clean up
        file_path.unlink()

        return {
            "status": "success",
            "filename": file.filename,
            "data": result
        }

    except Exception as e:
        # Clean up in case of error
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing file: {str(e)}"
        )

@router.get("/templates/{template_name}")
async def download_template(template_name: str):
    """
    Serve template files
    """
    templates_dir = Path("templates")
    template_path = templates_dir / template_name

    if not template_path.exists() or not template_path.is_file():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Template '{template_name}' not found"
        )

    return FileResponse(
        template_path,
        filename=template_name,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
