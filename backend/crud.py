"""CRUD operations for database models"""

from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from uuid import UUID
import models
import schemas

# Product CRUD Operations
def get_product(db: Session, product_id: UUID):
    """Get a single product by ID"""
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_product_by_barcode(db: Session, barcode: str):
    """Get a product by barcode"""
    return db.query(models.Product).filter(models.Product.barcode == barcode).first()

def get_products(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    category: Optional[str] = None,
    search: Optional[str] = None
):
    """Get list of products with optional filtering"""
    query = db.query(models.Product)
    
    if category:
        query = query.filter(models.Product.category == category)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                models.Product.name.ilike(search_filter),
                models.Product.brand.ilike(search_filter),
                models.Product.barcode.ilike(search_filter)
            )
        )
    
    return query.offset(skip).limit(limit).all()

def create_product(db: Session, product: schemas.ProductCreate):
    """Create a new product"""
    # Convert Pydantic model to dict with proper field mapping
    product_data = product.dict()
    # Map custom_fields back to the database column name
    if 'custom_fields' in product_data:
        product_data['custom_fields'] = product_data.get('custom_fields', {})
    
    db_product = models.Product(**product_data)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: UUID, product: schemas.ProductUpdate):
    """Update an existing product"""
    db_product = get_product(db, product_id)
    if db_product:
        update_data = product.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_product, key, value)
        db.commit()
        db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: UUID):
    """Delete a product"""
    db_product = get_product(db, product_id)
    if db_product:
        db.delete(db_product)
        db.commit()
    return db_product

def update_product_metadata(db: Session, product_id: UUID, metadata: dict):
    """Update product metadata (merge with existing)"""
    db_product = get_product(db, product_id)
    if db_product:
        # Merge metadata
        current_metadata = db_product.custom_fields or {}
        current_metadata.update(metadata)
        db_product.custom_fields = current_metadata
        db.commit()
        db.refresh(db_product)
    return db_product

def update_product_ai_data(db: Session, product_id: UUID, ai_data: dict):
    """Update product AI analysis data"""
    db_product = get_product(db, product_id)
    if db_product:
        db_product.ai_data = ai_data
        db.commit()
        db.refresh(db_product)
    return db_product

# Stock Movement CRUD Operations
def create_stock_movement(db: Session, movement: schemas.StockMovementCreate):
    """Create a stock movement and update product quantity"""
    db_movement = models.StockMovement(**movement.dict())
    db.add(db_movement)
    
    # Update product stock quantity
    product = get_product(db, movement.product_id)
    if product:
        if movement.movement_type == "in" or movement.movement_type == "initial":
            product.stock_quantity += movement.quantity
        elif movement.movement_type == "out":
            product.stock_quantity -= movement.quantity
        elif movement.movement_type == "adjustment":
            product.stock_quantity = movement.quantity
    
    db.commit()
    db.refresh(db_movement)
    return db_movement

def get_stock_movements(db: Session, product_id: UUID, skip: int = 0, limit: int = 50):
    """Get stock movements for a product"""
    return db.query(models.StockMovement)\
        .filter(models.StockMovement.product_id == product_id)\
        .order_by(models.StockMovement.created_at.desc())\
        .offset(skip).limit(limit).all()

# Product Image CRUD Operations
def create_product_image(db: Session, image: schemas.ProductImageCreate):
    """Create a product image"""
    # If this is marked as primary, unset other primary images
    if image.is_primary:
        db.query(models.ProductImage)\
            .filter(models.ProductImage.product_id == image.product_id)\
            .update({"is_primary": False})
    
    db_image = models.ProductImage(**image.dict())
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

def get_product_images(db: Session, product_id: UUID):
    """Get all images for a product"""
    return db.query(models.ProductImage)\
        .filter(models.ProductImage.product_id == product_id)\
        .order_by(models.ProductImage.is_primary.desc(), models.ProductImage.created_at)\
        .all()

def delete_product_image(db: Session, image_id: UUID):
    """Delete a product image"""
    db_image = db.query(models.ProductImage).filter(models.ProductImage.id == image_id).first()
    if db_image:
        db.delete(db_image)
        db.commit()
    return db_image