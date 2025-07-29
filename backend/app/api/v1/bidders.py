from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class BidderBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    address: Optional[str] = None
    is_active: bool = True

class BidderCreate(BidderBase):
    pass

class BidderUpdate(BidderBase):
    name: Optional[str] = None
    email: Optional[str] = None

class BidderInDB(BidderBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Mock database
bidders_db = {}
bidder_id_counter = 1

@router.get("/", response_model=List[BidderInDB])
async def list_bidders(
    skip: int = 0,
    limit: int = 100,
    is_active: Optional[bool] = None,
    search: Optional[str] = None
):
    """
    List all bidders with optional filtering
    """
    result = list(bidders_db.values())

    if is_active is not None:
        result = [b for b in result if b.is_active == is_active]

    if search:
        search = search.lower()
        result = [
            b for b in result
            if search in b.name.lower() or
               (b.company and search in b.company.lower())
        ]

    return result[skip:skip + limit]

@router.post("/", response_model=BidderInDB, status_code=status.HTTP_201_CREATED)
async def create_bidder(bidder: BidderCreate):
    """
    Create a new bidder
    """
    global bidder_id_counter

    # Check if email already exists
    if any(b.email.lower() == bidder.email.lower() for b in bidders_db.values()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new bidder
    db_bidder = BidderInDB(
        id=bidder_id_counter,
        **bidder.dict(),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    bidders_db[bidder_id_counter] = db_bidder
    bidder_id_counter += 1

    return db_bidder

@router.get("/{bidder_id}", response_model=BidderInDB)
async def get_bidder(bidder_id: int):
    """
    Get a specific bidder by ID
    """
    if bidder_id not in bidders_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bidder not found"
        )
    return bidders_db[bidder_id]

@router.put("/{bidder_id}", response_model=BidderInDB)
async def update_bidder(bidder_id: int, bidder: BidderUpdate):
    """
    Update a bidder
    """
    if bidder_id not in bidders_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bidder not found"
        )

    # Check if email is being changed to an existing email
    if bidder.email and bidder.email != bidders_db[bidder_id].email:
        if any(b.email.lower() == bidder.email.lower() for b in bidders_db.values()):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

    # Update fields
    db_bidder = bidders_db[bidder_id]
    update_data = bidder.dict(exclude_unset=True)

    for field, value in update_data.items():
        if value is not None:
            setattr(db_bidder, field, value)

    db_bidder.updated_at = datetime.utcnow()

    return db_bidder

@router.delete("/{bidder_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_bidder(bidder_id: int):
    """
    Delete a bidder (soft delete)
    """
    if bidder_id not in bidders_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bidder not found"
        )

    # Soft delete
    bidders_db[bidder_id].is_active = False
    bidders_db[bidder_id].updated_at = datetime.utcnow()

    return None
