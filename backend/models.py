"""SQLAlchemy models for InventoScan"""

from sqlalchemy import Column, String, Integer, Numeric, DateTime, Boolean, ForeignKey, Text, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from database import Base

class Product(Base):
    __tablename__ = "products"
    
    # Primary key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Core required fields
    name = Column(String(255), nullable=False)
    barcode = Column(String(50), index=True)
    category = Column(String(100), index=True)
    stock_quantity = Column(Integer, default=0, nullable=False)
    
    # Optional standard fields
    brand = Column(String(100))
    location = Column(String(50))
    condition = Column(String(20))  # new, used, refurbished, damaged
    purchase_price = Column(Numeric(10, 2))
    selling_price = Column(Numeric(10, 2))
    
    # Flexible JSON fields for extensibility
    custom_fields = Column("metadata", JSONB, default={}, nullable=False)  # User-defined custom fields
    ai_data = Column(JSONB, default={}, nullable=False)   # AI analysis results
    
    # System timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
    stock_movements = relationship("StockMovement", back_populates="product", cascade="all, delete-orphan")
    
    # Constraints
    __table_args__ = (
        CheckConstraint('stock_quantity >= 0', name='check_stock_quantity_positive'),
        CheckConstraint("condition IN ('new', 'used', 'refurbished', 'damaged') OR condition IS NULL", 
                       name='check_valid_condition'),
        CheckConstraint('purchase_price >= 0 OR purchase_price IS NULL', name='check_purchase_price_positive'),
        CheckConstraint('selling_price >= 0 OR selling_price IS NULL', name='check_selling_price_positive'),
    )


class ProductImage(Base):
    __tablename__ = "product_images"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), index=True)
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255))
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer)
    mime_type = Column(String(50))
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    product = relationship("Product", back_populates="images")


class StockMovement(Base):
    __tablename__ = "stock_movements"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), index=True)
    movement_type = Column(String(20), nullable=False)  # in, out, adjustment, initial
    quantity = Column(Integer, nullable=False)
    reason = Column(String(255))
    reference_number = Column(String(100))
    notes = Column(Text)
    created_by = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    # Relationships
    product = relationship("Product", back_populates="stock_movements")
    
    # Constraints
    __table_args__ = (
        CheckConstraint("movement_type IN ('in', 'out', 'adjustment', 'initial')", 
                       name='check_valid_movement_type'),
    )