"""Pydantic schemas for marketplace API validation"""

from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional, Dict, Any, List
from datetime import datetime, date
from uuid import UUID
from decimal import Decimal

# ========== PRODUCT SCHEMAS ==========

class ProductIdentification(BaseModel):
    """Product identification numbers"""
    ean: Optional[str] = Field(None, max_length=13, pattern="^[0-9]{8,13}$")
    upc: Optional[str] = Field(None, max_length=12, pattern="^[0-9]{12}$")
    isbn: Optional[str] = Field(None, max_length=13)
    asin: Optional[str] = Field(None, max_length=10)
    mpn: Optional[str] = Field(None, max_length=100)
    sku: Optional[str] = Field(None, max_length=100)

class ProductDimensions(BaseModel):
    """Product physical dimensions"""
    weight_kg: Optional[Decimal] = Field(None, ge=0, le=9999.999)
    weight_unit: Optional[str] = Field('kg', pattern="^(kg|g|lb|oz)$")
    length_cm: Optional[Decimal] = Field(None, ge=0, le=9999.99)
    width_cm: Optional[Decimal] = Field(None, ge=0, le=9999.99)
    height_cm: Optional[Decimal] = Field(None, ge=0, le=9999.99)
    dimension_unit: Optional[str] = Field('cm', pattern="^(cm|mm|in)$")

class ProductPricing(BaseModel):
    """Multi-channel pricing"""
    cost_price: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    price_regular: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    price_ebay: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    price_amazon: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    price_shop: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    price_minimum: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    vat_rate: Optional[Decimal] = Field(19.0, ge=0, le=100)

class ProductCompliance(BaseModel):
    """Compliance and customs information"""
    hs_code: Optional[str] = Field(None, max_length=15)
    country_of_origin: Optional[str] = Field(None, max_length=2, pattern="^[A-Z]{2}$")
    ce_marking: bool = False
    rohs_compliant: bool = False
    reach_compliant: bool = False

class ProductMarketplaceBase(BaseModel):
    """Complete marketplace product"""
    # Basic Info
    title: str = Field(..., min_length=1, max_length=200)
    brand: str = Field(..., min_length=1, max_length=100)
    model: Optional[str] = Field(None, max_length=100)
    product_type: Optional[str] = Field(None, max_length=100)
    
    # Identification
    ean: Optional[str] = Field(None, max_length=13)
    upc: Optional[str] = Field(None, max_length=12)
    isbn: Optional[str] = Field(None, max_length=13)
    asin: Optional[str] = Field(None, max_length=10)
    mpn: Optional[str] = Field(None, max_length=100)
    sku: Optional[str] = Field(None, max_length=100)
    
    # Dimensions
    weight_kg: Optional[Decimal] = Field(None, ge=0)
    length_cm: Optional[Decimal] = Field(None, ge=0)
    width_cm: Optional[Decimal] = Field(None, ge=0)
    height_cm: Optional[Decimal] = Field(None, ge=0)
    
    # Descriptions
    description_short: Optional[str] = Field(None, max_length=500)
    description_html: Optional[str] = None
    bullet_points: Optional[List[str]] = Field(None, max_items=10)
    search_terms: Optional[List[str]] = Field(None, max_items=50)
    
    # Pricing
    cost_price: Optional[Decimal] = Field(None, ge=0)
    price_regular: Optional[Decimal] = Field(None, ge=0)
    price_ebay: Optional[Decimal] = Field(None, ge=0)
    price_amazon: Optional[Decimal] = Field(None, ge=0)
    
    # Inventory
    stock_quantity: int = Field(0, ge=0)
    stock_location: Optional[str] = Field(None, max_length=100)
    
    # Categories
    category_ebay: Optional[str] = Field(None, max_length=100)
    category_amazon: Optional[str] = Field(None, max_length=100)
    category_google: Optional[str] = Field(None, max_length=200)
    
    # Compliance
    hs_code: Optional[str] = Field(None, max_length=15)
    country_of_origin: Optional[str] = Field(None, max_length=2)
    
    # Attributes
    color: Optional[str] = Field(None, max_length=50)
    size: Optional[str] = Field(None, max_length=50)
    material: Optional[str] = Field(None, max_length=100)
    condition: Optional[str] = Field('new', pattern="^(new|used|refurbished|damaged)$")
    
    # Flexible Fields
    specifications: Dict[str, Any] = Field(default_factory=dict)
    attributes: Dict[str, Any] = Field(default_factory=dict)
    
    @field_validator('title')
    def validate_title_length(cls, v):
        """Ensure title meets marketplace requirements"""
        if len(v) > 80:
            # Warning for eBay (80 char limit for most categories)
            pass
        if len(v) > 200:
            raise ValueError('Title must be 200 characters or less for Amazon')
        return v
    
    @field_validator('bullet_points')
    def validate_bullet_points(cls, v):
        """Validate bullet points for marketplace requirements"""
        if v:
            for i, bullet in enumerate(v):
                if len(bullet) > 500:
                    raise ValueError(f'Bullet point {i+1} exceeds 500 character limit')
        return v

class ProductMarketplaceCreate(ProductMarketplaceBase):
    """Create a new marketplace product"""
    pass

class ProductMarketplaceUpdate(BaseModel):
    """Update marketplace product"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    brand: Optional[str] = Field(None, min_length=1, max_length=100)
    # ... include all fields as optional
    
class ProductMarketplace(ProductMarketplaceBase):
    """Complete marketplace product response"""
    id: UUID
    status: str = 'draft'
    listed_on_ebay: bool = False
    listed_on_amazon: bool = False
    ebay_item_id: Optional[str] = None
    amazon_listing_id: Optional[str] = None
    images: Dict[str, Any] = {}
    ai_suggestions: Dict[str, Any] = {}
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# ========== AI ANALYSIS SCHEMAS ==========

class AIMarketplaceAnalysis(BaseModel):
    """AI analysis optimized for marketplace data"""
    # Product identification
    detected_brand: Optional[str] = None
    detected_model: Optional[str] = None
    detected_mpn: Optional[str] = None
    detected_ean: Optional[str] = None
    
    # Product details
    suggested_title: str
    suggested_category_ebay: Optional[str] = None
    suggested_category_amazon: Optional[str] = None
    suggested_bullet_points: List[str] = Field(default_factory=list, max_items=5)
    
    # Specifications
    detected_specifications: Dict[str, str] = Field(default_factory=dict)
    detected_material: Optional[str] = None
    detected_color: Optional[str] = None
    detected_size: Optional[str] = None
    detected_din_iso: Optional[str] = None
    
    # Compliance
    suggested_hs_code: Optional[str] = None
    detected_certifications: List[str] = Field(default_factory=list)
    
    # Confidence scores
    confidence_brand: float = Field(0.0, ge=0, le=1)
    confidence_model: float = Field(0.0, ge=0, le=1)
    confidence_category: float = Field(0.0, ge=0, le=1)

# ========== EXPORT SCHEMAS ==========

class EbayExportFormat(BaseModel):
    """eBay CSV export format"""
    Title: str = Field(..., max_length=80)
    Brand: str
    MPN: Optional[str] = None
    EAN: Optional[str] = None
    StartPrice: Decimal
    Quantity: int
    Description: str
    PrimaryCategory: Optional[str] = None
    ConditionID: str = '1000'  # 1000=New, 3000=Used
    ItemSpecifics: Dict[str, str] = Field(default_factory=dict)
    ImageURL1: Optional[str] = None
    ImageURL2: Optional[str] = None
    ImageURL3: Optional[str] = None

class AmazonExportFormat(BaseModel):
    """Amazon flat file format"""
    sku: str
    product_id: Optional[str] = None
    product_id_type: str = 'EAN'
    item_name: str = Field(..., max_length=200)
    brand_name: str
    manufacturer: str
    part_number: Optional[str] = None
    standard_price: Decimal
    quantity: int
    product_description: Optional[str] = Field(None, max_length=2000)
    bullet_point1: Optional[str] = Field(None, max_length=500)
    bullet_point2: Optional[str] = Field(None, max_length=500)
    bullet_point3: Optional[str] = Field(None, max_length=500)
    bullet_point4: Optional[str] = Field(None, max_length=500)
    bullet_point5: Optional[str] = Field(None, max_length=500)
    main_image_url: Optional[str] = None
    other_image_url1: Optional[str] = None
    other_image_url2: Optional[str] = None

# ========== VALIDATION RESULT ==========

class MarketplaceValidation(BaseModel):
    """Validation results for marketplace requirements"""
    is_valid: bool
    errors: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    marketplace: str  # ebay, amazon
    
    # Specific checks
    has_required_ids: bool = False
    has_valid_title: bool = False
    has_valid_images: bool = False
    has_valid_price: bool = False
    has_valid_category: bool = False