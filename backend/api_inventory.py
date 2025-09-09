from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import List, Optional
from datetime import datetime, timedelta
from uuid import UUID

from database import get_db
from models import Product, ProductImage, StockMovement
from schemas import ProductCreate, ProductUpdate, ProductResponse

router = APIRouter(prefix="/api/inventory", tags=["inventory"])

@router.get("/products", response_model=List[ProductResponse])
async def get_products(
    search: Optional[str] = Query(None, description="Search term for name, brand, or barcode"),
    category: Optional[str] = Query(None, description="Filter by category"),
    location: Optional[str] = Query(None, description="Filter by location"),
    low_stock: Optional[bool] = Query(False, description="Show only low stock items"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=500),
    db: Session = Depends(get_db)
):
    """Get all products with optional filters"""
    query = db.query(Product)
    
    # Apply search filter
    if search:
        search_filter = or_(
            Product.name.ilike(f"%{search}%"),
            Product.brand.ilike(f"%{search}%"),
            Product.barcode.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)
    
    # Apply category filter
    if category and category != 'all':
        query = query.filter(Product.category == category)
    
    # Apply location filter  
    if location and location != 'all':
        query = query.filter(Product.location == location)
    
    # Apply low stock filter
    if low_stock:
        query = query.filter(Product.stock_quantity <= Product.min_stock)
    
    # Get total count before pagination
    total = query.count()
    
    # Apply pagination and get results
    products = query.offset(skip).limit(limit).all()
    
    return products

@router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: UUID, db: Session = Depends(get_db)):
    """Get a single product by ID"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/products", response_model=ProductResponse)
async def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    """Create a new product"""
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: UUID,
    product: ProductUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing product"""
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Update only provided fields
    update_data = product.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    db_product.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/products/{product_id}")
async def delete_product(product_id: UUID, db: Session = Depends(get_db)):
    """Delete a product"""
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted successfully"}

@router.get("/categories")
async def get_categories(db: Session = Depends(get_db)):
    """Get all unique categories"""
    categories = db.query(Product.category).distinct().filter(Product.category.isnot(None)).all()
    return [cat[0] for cat in categories]

@router.get("/locations")
async def get_locations(db: Session = Depends(get_db)):
    """Get all unique locations"""
    locations = db.query(Product.location).distinct().filter(Product.location.isnot(None)).all()
    return [loc[0] for loc in locations]

@router.get("/dashboard/stats")
async def get_dashboard_stats(
    time_range: str = Query("month", regex="^(week|month|year)$"),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics"""
    
    # Calculate date range
    now = datetime.utcnow()
    if time_range == "week":
        start_date = now - timedelta(days=7)
    elif time_range == "month":
        start_date = now - timedelta(days=30)
    else:  # year
        start_date = now - timedelta(days=365)
    
    # Get total products
    total_products = db.query(func.count(Product.id)).scalar()
    
    # Calculate total value
    total_value = db.query(
        func.sum(Product.stock_quantity * Product.price_regular)
    ).filter(Product.price_regular.isnot(None)).scalar() or 0
    
    # Get low stock items
    low_stock_items = db.query(func.count(Product.id)).filter(
        Product.stock_quantity <= Product.min_stock
    ).scalar()
    
    # Get unique categories and locations
    categories = db.query(func.count(func.distinct(Product.category))).scalar()
    locations = db.query(func.count(func.distinct(Product.location))).scalar()
    
    # Get recent products
    recent_products = db.query(Product).filter(
        Product.created_at >= start_date
    ).order_by(Product.created_at.desc()).limit(5).all()
    
    # Get category breakdown
    category_breakdown = db.query(
        Product.category,
        func.count(Product.id).label('count'),
        func.sum(Product.stock_quantity * Product.price_regular).label('value')
    ).filter(
        Product.category.isnot(None),
        Product.price_regular.isnot(None)
    ).group_by(Product.category).all()
    
    # Get stock alerts
    stock_alerts = db.query(Product).filter(
        Product.stock_quantity <= Product.min_stock
    ).limit(10).all()
    
    return {
        "total_products": total_products,
        "total_value": float(total_value),
        "low_stock_items": low_stock_items,
        "categories": categories,
        "locations": locations,
        "recent_products": [
            {
                "id": str(p.id),
                "name": p.name,
                "brand": p.brand,
                "stock_quantity": p.stock_quantity,
                "price_regular": p.price_regular,
                "created_at": p.created_at.isoformat()
            }
            for p in recent_products
        ],
        "category_breakdown": [
            {
                "name": cat.category,
                "count": cat.count,
                "value": float(cat.value) if cat.value else 0
            }
            for cat in category_breakdown
        ],
        "stock_alerts": [
            {
                "id": str(p.id),
                "product_name": p.name,
                "current_stock": p.stock_quantity,
                "min_stock": p.min_stock,
                "location": p.location
            }
            for p in stock_alerts
        ]
    }

@router.post("/products/{product_id}/stock-movement")
async def add_stock_movement(
    product_id: UUID,
    movement_type: str = Query(..., regex="^(in|out|adjustment)$"),
    quantity: int = Query(..., gt=0),
    notes: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Add a stock movement (in/out/adjustment)"""
    # Get the product
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Update stock quantity
    if movement_type == "in":
        product.stock_quantity += quantity
    elif movement_type == "out":
        if product.stock_quantity < quantity:
            raise HTTPException(status_code=400, detail="Insufficient stock")
        product.stock_quantity -= quantity
    else:  # adjustment
        product.stock_quantity = quantity
    
    # Create stock movement record
    movement = StockMovement(
        product_id=product_id,
        movement_type=movement_type,
        quantity=quantity,
        notes=notes
    )
    
    db.add(movement)
    product.updated_at = datetime.utcnow()
    db.commit()
    
    return {
        "message": "Stock movement recorded",
        "new_quantity": product.stock_quantity
    }

@router.get("/products/{product_id}/stock-history")
async def get_stock_history(
    product_id: UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, le=200),
    db: Session = Depends(get_db)
):
    """Get stock movement history for a product"""
    movements = db.query(StockMovement).filter(
        StockMovement.product_id == product_id
    ).order_by(
        StockMovement.created_at.desc()
    ).offset(skip).limit(limit).all()
    
    return [
        {
            "id": str(m.id),
            "movement_type": m.movement_type,
            "quantity": m.quantity,
            "notes": m.notes,
            "created_at": m.created_at.isoformat()
        }
        for m in movements
    ]