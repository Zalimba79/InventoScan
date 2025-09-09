"""Pydantic schemas for API validation"""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID
from decimal import Decimal

# Product Schemas
class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    barcode: Optional[str] = Field(None, max_length=50)
    category: Optional[str] = Field(None, max_length=100)
    stock_quantity: int = Field(0, ge=0)
    brand: Optional[str] = Field(None, max_length=100)
    location: Optional[str] = Field(None, max_length=50)
    condition: Optional[str] = Field(None, pattern="^(new|used|refurbished|damaged)$")
    purchase_price: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    selling_price: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    custom_fields: Dict[str, Any] = Field(default_factory=dict, serialization_alias="metadata")
    ai_data: Dict[str, Any] = Field(default_factory=dict)
    
    model_config = ConfigDict(populate_by_name=True)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    barcode: Optional[str] = Field(None, max_length=50)
    category: Optional[str] = Field(None, max_length=100)
    stock_quantity: Optional[int] = Field(None, ge=0)
    brand: Optional[str] = Field(None, max_length=100)
    location: Optional[str] = Field(None, max_length=50)
    condition: Optional[str] = Field(None, pattern="^(new|used|refurbished|damaged)$")
    purchase_price: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    selling_price: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    custom_fields: Optional[Dict[str, Any]] = Field(None, serialization_alias="metadata")
    ai_data: Optional[Dict[str, Any]] = None

class Product(ProductBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    images: List['ProductImage'] = []
    
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

# Product Image Schemas
class ProductImageBase(BaseModel):
    filename: str
    original_filename: Optional[str] = None
    file_path: str
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    is_primary: bool = False

class ProductImageCreate(ProductImageBase):
    product_id: UUID

class ProductImage(ProductImageBase):
    id: UUID
    product_id: UUID
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# Stock Movement Schemas
class StockMovementBase(BaseModel):
    movement_type: str = Field(..., pattern="^(in|out|adjustment|initial)$")
    quantity: int
    reason: Optional[str] = Field(None, max_length=255)
    reference_number: Optional[str] = Field(None, max_length=100)
    notes: Optional[str] = None
    created_by: Optional[str] = Field(None, max_length=100)

class StockMovementCreate(StockMovementBase):
    product_id: UUID

class StockMovement(StockMovementBase):
    id: UUID
    product_id: UUID
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# AI Analysis Response
class AIAnalysisResponse(BaseModel):
    product_name: str
    brand: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    barcode: Optional[str] = None
    quantity: Optional[str] = None
    additional_info: Optional[str] = None
    image_id: str
    analyzed_at: str
    original_filename: str

# Product Response (alias for Product)
ProductResponse = Product

# Product with Analysis
class ProductWithAnalysis(Product):
    analysis: Optional[AIAnalysisResponse] = None