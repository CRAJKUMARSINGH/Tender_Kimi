from fastapi import APIRouter, HTTPException, status, Query, BackgroundTasks
from fastapi.responses import FileResponse
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime, date
from enum import Enum
import os
from pathlib import Path
import pandas as pd
import tempfile

router = APIRouter()

class ReportType(str, Enum):
    BIDDERS = "bidders"
    TENDERS = "tenders"
    AWARDS = "awards"

class ReportFormat(str, Enum):
    EXCEL = "xlsx"
    CSV = "csv"
    PDF = "pdf"

class ReportFilter(BaseModel):
    start_date: Optional[date] = Field(None, description="Start date for filtering")
    end_date: Optional[date] = Field(None, description="End date for filtering")
    status: Optional[str] = Field(None, description="Filter by status"n    )

# Mock data generation
def generate_mock_report_data(report_type: ReportType, filters: ReportFilter):
    """Generate mock report data based on type and filters"""
    if report_type == ReportType.BIDDERS:
        return [
            {"id": 1, "name": "Bidder 1", "email": "bidder1@example.com", "tenders_participated": 5, "status": "active"},
            {"id": 2, "name": "Bidder 2", "email": "bidder2@example.com", "tenders_participated": 3, "status": "inactive"},
        ]
    elif report_type == ReportType.TENDERS:
        return [
            {"id": 1, "title": "Tender 1", "status": "open", "opening_date": "2023-01-01", "closing_date": "2023-02-01"},
            {"id": 2, "title": "Tender 2", "status": "closed", "opening_date": "2023-02-01", "closing_date": "2023-03-01"},
        ]
    return []

@router.get("/types")
async def get_report_types():
    """Get available report types"""
    return [{"id": rt.value, "name": rt.name.replace('_', ' ').title()} for rt in ReportType]

@router.post("/generate/{report_type}")
async def generate_report(
    report_type: ReportType,
    format: ReportFormat = ReportFormat.EXCEL,
    filters: Optional[ReportFilter] = None,
    background_tasks: BackgroundTasks = None
):
    """
    Generate a report of the specified type and format
    """
    if filters is None:
        filters = ReportFilter()

    # Generate report data
    data = generate_mock_report_data(report_type, filters)

    if not data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No data found for report type: {report_type}"
        )

    # Create a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{format}") as tmp:
        file_path = tmp.name

    # Save data to file based on format
    try:
        df = pd.DataFrame(data)
        if format == ReportFormat.EXCEL:
            df.to_excel(file_path, index=False, engine='openpyxl')
            media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        elif format == ReportFormat.CSV:
            df.to_csv(file_path, index=False)
            media_type = "text/csv"
        else:  # PDF
            # For PDF, we'll use a simple HTML to PDF conversion
            html = df.to_html(index=False)
            # In a real app, you would use a library like weasyprint or reportlab
            # For now, we'll just save as HTML
            with open(file_path, 'w') as f:
                f.write(html)
            media_type = "text/html"

        # Schedule file cleanup after response is sent
        if background_tasks is not None:
            background_tasks.add_task(cleanup_file, file_path)

        filename = f"{report_type}_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{format}"

        return FileResponse(
            file_path,
            media_type=media_type,
            filename=filename,
            background=background_tasks
        )

    except Exception as e:
        # Clean up the temporary file in case of error
        cleanup_file(file_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating report: {str(e)}"
        )

def cleanup_file(file_path: str):
    """Clean up temporary files"""
    try:
        if os.path.exists(file_path):
            os.unlink(file_path)
    except Exception as e:
        # Log error but don't fail
        print(f"Error cleaning up file {file_path}: {e}")
