import pandas as pd
import logging
from typing import Dict, Any, Optional, List, Union
import re
import asyncio
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

# Import the original parser
from ...Reference-Python-Priyanka_TenderV03.excel_parser import ExcelParser as SyncExcelParser

logger = logging.getLogger(__name__)

class AsyncExcelParser:
    """Async wrapper around the ExcelParser with FastAPI integration."""
    
    def __init__(self):
        self.parser = SyncExcelParser()
        self.executor = ThreadPoolExecutor()
    
    async def parse_nit_excel(self, file_path: Union[str, Path]) -> Optional[Dict[str, Any]]:
        """
        Parse NIT Excel file asynchronously.
        
        Args:
            file_path: Path to the Excel file
            
        Returns:
            Dictionary containing parsed work information or None if parsing fails
        """
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            self.executor,
            self._run_parser,
            str(file_path)
        )
    
    def _run_parser(self, file_path: str) -> Optional[Dict[str, Any]]:
        """Run the synchronous parser in the executor."""
        try:
            return self.parser.parse_nit_excel(file_path)
        except Exception as e:
            logger.error(f"Error parsing Excel file {file_path}: {e}")
            return None
    
    def cleanup(self):
        """Clean up resources."""
        self.executor.shutdown(wait=True)

# Create a singleton instance
parser = AsyncExcelParser()

async def get_excel_parser() -> AsyncExcelParser:
    """Dependency to get the Excel parser instance."""
    return parser
