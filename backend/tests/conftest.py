"""
Test configuration and fixtures for the Tender Kimi backend.
"""
import os
import sys
import pytest
import pandas as pd
import numpy as np
from fastapi.testclient import TestClient

# Add the parent directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import app

@pytest.fixture(scope="module")
def test_client():
    """Create a test client for the FastAPI application."""
    with TestClient(app) as client:
        yield client

@pytest.fixture(scope="module")
def test_data_dir():
    """Return the path to the test data directory."""
    test_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(test_dir, 'data')
    os.makedirs(data_dir, exist_ok=True)
    return data_dir

@pytest.fixture(scope="module")
def sample_bid_data(test_data_dir):
    """Generate sample bid data for testing."""
    file_path = os.path.join(test_data_dir, 'sample_bids.xlsx')

    # Generate test data if it doesn't exist
    if not os.path.exists(file_path):
        np.random.seed(42)
        num_bidders = 20
        bid_amounts = np.random.normal(loc=1000000, scale=200000, size=num_bidders).astype(int)
        bid_amounts = np.maximum(bid_amounts, 500000)  # Ensure no negative bids

        data = {
            'bidder_id': [f'BID{1000 + i}' for i in range(num_bidders)],
            'bidder_name': [f'Bidder {chr(65 + i % 26)}{i//26 + 1}' for i in range(num_bidders)],
            'bid_amount': bid_amounts
        }

        df = pd.DataFrame(data)
        df.to_excel(file_path, index=False, engine='openpyxl')

    return file_path
