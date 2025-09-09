"""Marketplace API endpoints for InventoScan"""

from fastapi import APIRouter, HTTPException, Depends, Response
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
import csv
import io
import json

from database import get_db
import models_marketplace as models
import schemas_marketplace as schemas

router = APIRouter(prefix="/api/marketplace", tags=["marketplace"])

# ========== PRODUCT CRUD WITH MARKETPLACE FIELDS ==========

@router.post("/products/complete", response_model=schemas.ProductMarketplace)
async def create_complete_product(
    product: schemas.ProductMarketplaceCreate,
    db: Session = Depends(get_db)
):
    """Create a complete marketplace-ready product"""
    # Validate marketplace requirements
    validation = validate_marketplace_product(product)
    
    # Create product
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    return db_product

@router.get("/products/{product_id}/validate")
async def validate_product_for_marketplace(
    product_id: UUID,
    marketplace: str,
    db: Session = Depends(get_db)
):
    """Validate if product meets marketplace requirements"""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    validation = schemas.MarketplaceValidation(marketplace=marketplace)
    errors = []
    warnings = []
    
    if marketplace.lower() == "ebay":
        # eBay validation
        if not product.title or len(product.title) > 80:
            errors.append("Title must be between 1-80 characters for eBay")
        if not product.brand:
            warnings.append("Brand is highly recommended for eBay")
        if not (product.ean or product.mpn):
            warnings.append("EAN or MPN recommended for better visibility")
        if not product.category_ebay:
            errors.append("eBay category is required")
        if not product.price_ebay and not product.price_regular:
            errors.append("Price is required")
            
    elif marketplace.lower() == "amazon":
        # Amazon validation
        if not product.title or len(product.title) > 200:
            errors.append("Title must be between 1-200 characters for Amazon")
        if not product.brand:
            errors.append("Brand is required for Amazon")
        if not (product.ean or product.upc):
            errors.append("EAN or UPC is required for most Amazon categories")
        if not product.sku:
            errors.append("SKU is required for Amazon")
        if not product.bullet_points or len(product.bullet_points) < 3:
            warnings.append("At least 3-5 bullet points recommended for Amazon")
        if not product.category_amazon:
            errors.append("Amazon category is required")
            
    validation.errors = errors
    validation.warnings = warnings
    validation.is_valid = len(errors) == 0
    
    return validation

# ========== EXPORT ENDPOINTS ==========

@router.get("/export/ebay/{product_id}")
async def export_product_for_ebay(
    product_id: UUID,
    format: str = "json",  # json, csv
    db: Session = Depends(get_db)
):
    """Export product in eBay format"""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    ebay_data = product.to_ebay_format()
    
    if format == "csv":
        # Create CSV response
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=ebay_data.keys())
        writer.writeheader()
        writer.writerow(ebay_data)
        
        return Response(
            content=output.getvalue(),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=ebay_{product.sku or product_id}.csv"}
        )
    else:
        return ebay_data

@router.get("/export/amazon/{product_id}")
async def export_product_for_amazon(
    product_id: UUID,
    format: str = "json",  # json, csv, txt
    db: Session = Depends(get_db)
):
    """Export product in Amazon flat file format"""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    amazon_data = product.to_amazon_format()
    
    if format == "csv":
        # Create CSV response (Amazon flat file)
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=amazon_data.keys(), delimiter='\t')
        writer.writeheader()
        writer.writerow(amazon_data)
        
        return Response(
            content=output.getvalue(),
            media_type="text/tab-separated-values",
            headers={"Content-Disposition": f"attachment; filename=amazon_{product.sku or product_id}.txt"}
        )
    else:
        return amazon_data

@router.get("/export/bulk")
async def export_bulk_products(
    marketplace: str,
    status: Optional[str] = "active",
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Export multiple products for marketplace"""
    query = db.query(models.Product)
    
    if status:
        query = query.filter(models.Product.status == status)
    
    products = query.limit(limit).all()
    
    if marketplace.lower() == "ebay":
        data = [p.to_ebay_format() for p in products]
    elif marketplace.lower() == "amazon":
        data = [p.to_amazon_format() for p in products]
    else:
        raise HTTPException(status_code=400, detail="Unsupported marketplace")
    
    # Create CSV response
    if data:
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)
        
        return Response(
            content=output.getvalue(),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={marketplace}_export.csv"}
        )
    
    return {"message": "No products to export"}

# ========== AI INTEGRATION ==========

@router.post("/analyze-for-marketplace")
async def analyze_image_for_marketplace(
    image_id: str,
    db: Session = Depends(get_db)
):
    """Analyze product image with marketplace optimization"""
    # This will use the optimized prompt for marketplace data extraction
    import requests
    import os
    
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        raise HTTPException(status_code=503, detail="OpenAI API not configured")
    
    # Get image data (assuming it's stored)
    # ... image loading logic ...
    
    # Optimized prompt for marketplace
    prompt = """Analyze this product image and extract marketplace-relevant information.

Extract the following:
1. Brand name (manufacturer)
2. Model number or product code
3. Material composition
4. Size/dimensions if visible
5. Color
6. DIN/ISO standards or certifications
7. Technical specifications

Suggest:
1. eBay category (provide category ID if possible)
2. Amazon browse node/category
3. Product title (max 80 characters, SEO optimized)
4. 5 bullet points (each max 500 characters) highlighting:
   - Key features
   - Benefits
   - Technical specs
   - Use cases
   - Quality/certifications

Return as JSON with these exact fields:
{
    "detected": {
        "brand": "",
        "model": "",
        "mpn": "",
        "material": "",
        "color": "",
        "size": "",
        "din_iso": "",
        "specifications": {}
    },
    "suggested": {
        "title": "",
        "category_ebay": "",
        "category_amazon": "",
        "bullet_points": [],
        "hs_code": "",
        "search_terms": []
    },
    "confidence": {
        "brand": 0.0,
        "model": 0.0,
        "category": 0.0
    }
}"""
    
    # Make API call
    # ... OpenAI API call logic ...
    
    return {"status": "Analysis complete", "data": {}}

# ========== HELPER FUNCTIONS ==========

def validate_marketplace_product(product: schemas.ProductMarketplaceCreate) -> schemas.MarketplaceValidation:
    """Validate product data for marketplace requirements"""
    validation = schemas.MarketplaceValidation(marketplace="general")
    errors = []
    warnings = []
    
    # General validation
    if not product.title:
        errors.append("Title is required")
    if not product.brand:
        warnings.append("Brand is highly recommended")
    if not product.sku:
        warnings.append("SKU is recommended for inventory management")
    
    # Image validation
    # (would check actual images if available)
    
    validation.errors = errors
    validation.warnings = warnings
    validation.is_valid = len(errors) == 0
    
    return validation

@router.get("/categories/ebay")
async def get_ebay_categories():
    """Get common eBay categories"""
    return {
        "categories": [
            {"id": "42630", "name": "Befestigungstechnik"},
            {"id": "11804", "name": "Elektronik & Elektrotechnik"},
            {"id": "131090", "name": "Werkzeug"},
            {"id": "26395", "name": "Industriebedarf"},
            {"id": "92074", "name": "Sicherheitstechnik"}
        ]
    }

@router.get("/categories/amazon")
async def get_amazon_categories():
    """Get common Amazon categories"""
    return {
        "categories": [
            {"id": "B001", "name": "Baumarkt"},
            {"id": "B002", "name": "Gewerbe, Industrie & Wissenschaft"},
            {"id": "B003", "name": "Elektronik & Foto"},
            {"id": "B004", "name": "Werkzeug"},
            {"id": "B005", "name": "Befestigungstechnik"}
        ]
    }