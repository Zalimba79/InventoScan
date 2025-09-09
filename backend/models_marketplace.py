"""SQLAlchemy models for marketplace-optimized InventoScan"""

from sqlalchemy import (
    Column, String, Integer, Numeric, DateTime, Boolean, 
    ForeignKey, Text, CheckConstraint, Date, ARRAY
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from database import Base

class Product(Base):
    __tablename__ = "products"
    
    # Primary key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # ========== IDENTIFICATION ==========
    ean = Column(String(13), index=True)
    upc = Column(String(12))
    isbn = Column(String(13))
    asin = Column(String(10))
    mpn = Column(String(100), index=True)
    sku = Column(String(100), unique=True, index=True)
    
    # ========== BASIC PRODUCT INFO ==========
    title = Column(String(200), nullable=False, index=True)
    brand = Column(String(100), nullable=False, index=True)
    model = Column(String(100))
    product_type = Column(String(100))
    
    # ========== PHYSICAL ATTRIBUTES ==========
    weight_kg = Column(Numeric(10, 3))
    weight_unit = Column(String(10), default='kg')
    length_cm = Column(Numeric(10, 2))
    width_cm = Column(Numeric(10, 2))
    height_cm = Column(Numeric(10, 2))
    dimension_unit = Column(String(10), default='cm')
    
    # ========== DESCRIPTIONS & SEO ==========
    description_short = Column(Text)
    description_html = Column(Text)
    bullet_points = Column(ARRAY(Text))
    search_terms = Column(ARRAY(Text))
    meta_title = Column(String(200))
    meta_description = Column(String(500))
    
    # ========== PRICING ==========
    cost_price = Column(Numeric(10, 2))
    price_regular = Column(Numeric(10, 2))
    price_ebay = Column(Numeric(10, 2))
    price_amazon = Column(Numeric(10, 2))
    price_shop = Column(Numeric(10, 2))
    price_minimum = Column(Numeric(10, 2))
    vat_rate = Column(Numeric(5, 2), default=19.0)
    
    # ========== INVENTORY ==========
    stock_quantity = Column(Integer, default=0, nullable=False)
    stock_location = Column(String(100))
    stock_minimum = Column(Integer, default=0)
    stock_reserved = Column(Integer, default=0)
    
    # ========== MARKETPLACE CATEGORIES ==========
    category_ebay = Column(String(100), index=True)
    category_amazon = Column(String(100), index=True)
    category_google = Column(String(200))
    category_internal = Column(String(100))
    
    # ========== COMPLIANCE & CUSTOMS ==========
    hs_code = Column(String(15))
    country_of_origin = Column(String(2))
    ce_marking = Column(Boolean, default=False)
    rohs_compliant = Column(Boolean, default=False)
    reach_compliant = Column(Boolean, default=False)
    
    # ========== PRODUCT ATTRIBUTES ==========
    color = Column(String(50))
    size = Column(String(50))
    material = Column(String(100))
    pattern = Column(String(50))
    style = Column(String(50))
    condition = Column(String(20), default='new')
    condition_notes = Column(Text)
    
    # ========== MANUFACTURER INFO ==========
    manufacturer = Column(String(100))
    manufacturer_warranty = Column(String(100))
    manufacture_date = Column(Date)
    expiry_date = Column(Date)
    
    # ========== PACKAGE INFO ==========
    package_weight_kg = Column(Numeric(10, 3))
    package_length_cm = Column(Numeric(10, 2))
    package_width_cm = Column(Numeric(10, 2))
    package_height_cm = Column(Numeric(10, 2))
    units_per_package = Column(Integer, default=1)
    
    # ========== LISTING STATUS ==========
    status = Column(String(20), default='draft', index=True)
    listed_on_ebay = Column(Boolean, default=False)
    listed_on_amazon = Column(Boolean, default=False)
    ebay_item_id = Column(String(50))
    amazon_listing_id = Column(String(50))
    
    # ========== IMAGES (JSON) ==========
    images = Column(JSONB, default={}, nullable=False)
    
    # ========== FLEXIBLE FIELDS ==========
    specifications = Column(JSONB, default={}, nullable=False)
    attributes = Column(JSONB, default={}, nullable=False)
    marketplace_data = Column(JSONB, default={}, nullable=False)
    ai_suggestions = Column(JSONB, default={}, nullable=False)
    
    # ========== SYSTEM FIELDS ==========
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    created_by = Column(String(100))
    updated_by = Column(String(100))
    
    # Relationships
    product_images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
    stock_movements = relationship("StockMovement", back_populates="product", cascade="all, delete-orphan")
    listing_history = relationship("ListingHistory", back_populates="product", cascade="all, delete-orphan")
    
    # Constraints
    __table_args__ = (
        CheckConstraint('stock_quantity >= 0', name='check_stock_quantity_positive'),
        CheckConstraint("condition IN ('new', 'used', 'refurbished', 'damaged')", 
                       name='check_valid_condition'),
        CheckConstraint("status IN ('draft', 'active', 'inactive', 'out_of_stock')",
                       name='check_valid_status'),
    )
    
    def to_ebay_format(self):
        """Convert product to eBay listing format"""
        return {
            'Title': self.title[:80],  # eBay title limit
            'Brand': self.brand,
            'MPN': self.mpn,
            'EAN': self.ean,
            'StartPrice': float(self.price_ebay or self.price_regular or 0),
            'Quantity': self.stock_quantity,
            'Description': self.description_html or self.description_short,
            'PrimaryCategory': self.category_ebay,
            'ConditionID': '1000' if self.condition == 'new' else '3000',
            'ItemSpecifics': self.specifications
        }
    
    def to_amazon_format(self):
        """Convert product to Amazon listing format"""
        return {
            'sku': self.sku,
            'product-id': self.ean or self.upc,
            'product-id-type': 'EAN' if self.ean else 'UPC',
            'item-name': self.title[:200],  # Amazon title limit
            'brand': self.brand,
            'manufacturer': self.manufacturer or self.brand,
            'part-number': self.mpn,
            'standard-price': float(self.price_amazon or self.price_regular or 0),
            'quantity': self.stock_quantity,
            'product-description': self.description_short[:2000] if self.description_short else '',
            'bullet-point1': self.bullet_points[0] if self.bullet_points and len(self.bullet_points) > 0 else '',
            'bullet-point2': self.bullet_points[1] if self.bullet_points and len(self.bullet_points) > 1 else '',
            'bullet-point3': self.bullet_points[2] if self.bullet_points and len(self.bullet_points) > 2 else '',
            'bullet-point4': self.bullet_points[3] if self.bullet_points and len(self.bullet_points) > 3 else '',
            'bullet-point5': self.bullet_points[4] if self.bullet_points and len(self.bullet_points) > 4 else '',
        }


class ProductImage(Base):
    __tablename__ = "product_images"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), index=True)
    image_type = Column(String(20), nullable=False, index=True)  # main, gallery, ebay, amazon, technical
    image_url = Column(String(500))
    file_path = Column(String(500))
    file_size = Column(Integer)
    width_px = Column(Integer)
    height_px = Column(Integer)
    alt_text = Column(String(200))
    position = Column(Integer, default=0)
    is_primary = Column(Boolean, default=False)
    marketplace_approved = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    product = relationship("Product", back_populates="product_images")


class StockMovement(Base):
    __tablename__ = "stock_movements"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), index=True)
    movement_type = Column(String(20), nullable=False)
    quantity = Column(Integer, nullable=False)
    reason = Column(String(255))
    reference_number = Column(String(100))
    order_id = Column(String(100))
    marketplace = Column(String(50))
    notes = Column(Text)
    created_by = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    # Relationships
    product = relationship("Product", back_populates="stock_movements")


class ListingHistory(Base):
    __tablename__ = "listing_history"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), index=True)
    marketplace = Column(String(50), nullable=False, index=True)
    action = Column(String(50), nullable=False)
    listing_id = Column(String(100))
    price = Column(Numeric(10, 2))
    quantity = Column(Integer)
    response_data = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    product = relationship("Product", back_populates="listing_history")