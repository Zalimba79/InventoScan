from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Form, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from datetime import datetime
from pathlib import Path
from typing import List, Optional
from uuid import UUID
import openai
import base64
import shutil
import uuid
import os
import json
import secrets

# Import database dependencies
from database import get_db, engine
import models
import schemas
import crud

# Import API routers
from api_inventory import router as inventory_router
from api_marketplace import router as marketplace_router

# Import CSRF protection
from csrf_protection import CSRFProtection, csrf_middleware, create_csrf_endpoint

# Import Rate Limiting
from rate_limiter import rate_limit_middleware, rate_limit, strict_limit

load_dotenv()

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="InventoScan API")

# Initialize CSRF Protection
SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_urlsafe(32))
csrf_protection = CSRFProtection(SECRET_KEY)
app.state.csrf_protection = csrf_protection

# Add middlewares
app.middleware("http")(rate_limit_middleware)  # Rate limiting first
app.middleware("http")(csrf_middleware)  # Then CSRF protection

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Max file size in bytes (10MB)
MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}

# Initialize OpenAI (will be None if no API key)
openai_api_key = os.getenv("OPENAI_API_KEY")
if openai_api_key:
    openai.api_key = openai_api_key
    client_available = True
else:
    client_available = False
    print("Warning: OpenAI API key not configured")

# Store uploaded images info (in production, use a database)
uploaded_images = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000", 
        "https://localhost:5173",
        "https://localhost:5174",
        "https://inventoscan.mindbit.net",
        "https://api.inventoscan.mindbit.net",
        "https://*.trycloudflare.com"  # Für Quick Tunnels
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(inventory_router)
app.include_router(marketplace_router)

@app.get("/")
async def root():
    return {"message": "InventoScan API läuft"}

@app.get("/api/health")
async def health():
    return {"status": "healthy"}

# CSRF Token endpoint
@app.get("/api/csrf-token")
async def get_csrf_token_endpoint(response: Response):
    """Get a new CSRF token for API requests"""
    return await create_csrf_endpoint(csrf_protection)(response)

@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    """
    Upload an image file with validation.
    - Max size: 10MB
    - Allowed formats: jpg, jpeg, png, webp, gif
    """
    # Check file extension
    file_extension = Path(file.filename).suffix.lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Check file size
    contents = await file.read()
    file_size = len(contents)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE / 1024 / 1024}MB"
        )
    
    # Generate unique filename
    unique_id = str(uuid.uuid4())
    filename = f"{unique_id}{file_extension}"
    file_path = UPLOAD_DIR / filename
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(contents)
        
        # Store image info
        image_info = {
            "id": unique_id,
            "filename": filename,
            "original_filename": file.filename,
            "path": str(file_path),
            "size": file_size,
            "uploaded_at": datetime.now().isoformat()
        }
        uploaded_images[unique_id] = image_info
        
        # Return response
        return image_info
    except Exception as e:
        # Clean up file if error occurs
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")

@app.post("/api/analyze/{image_id}")
async def analyze_image(image_id: str):
    """
    Analyze an uploaded image using OpenAI Vision API.
    Returns product information: name, brand, category, description.
    """
    # Check if OpenAI is configured
    if not client_available:
        raise HTTPException(
            status_code=503, 
            detail="OpenAI API key not configured. Please set OPENAI_API_KEY in backend/.env file"
        )
    
    # Check if image exists
    if image_id not in uploaded_images:
        raise HTTPException(status_code=404, detail="Image not found")
    
    image_info = uploaded_images[image_id]
    image_path = Path(image_info["path"])
    
    if not image_path.exists():
        raise HTTPException(status_code=404, detail="Image file not found")
    
    try:
        # Read and encode image
        with open(image_path, "rb") as image_file:
            base64_image = base64.b64encode(image_file.read()).decode('utf-8')
        
        # Use requests to call OpenAI API directly (avoiding proxy issues)
        import requests
        
        headers = {
            "Authorization": f"Bearer {openai_api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": """Analyze this product image for marketplace selling. Extract ALL visible information.

IDENTIFY (look for text, labels, markings):
- brand: Manufacturer/brand name
- model: Model number or product code  
- mpn: Manufacturer part number (e.g., Art. Nr., Item #)
- ean: EAN/UPC barcode number if visible
- material: Material composition (steel, plastic, aluminum, etc.)
- color: Product color
- size: Dimensions or size designation
- din_iso: DIN/ISO/EN standards (e.g., DIN 912, ISO 9001)
- country: Country of origin if marked
- certifications: CE, RoHS, TÜV, other certifications

ANALYZE TECHNICAL DETAILS:
- specifications: All technical specs (thread size, voltage, capacity, etc.)
- quantity_per_package: Number of items if bulk package
- surface_treatment: Coating/finish (galvanized, anodized, painted)

SUGGEST FOR MARKETPLACE (be specific):
- title: Product title max 80 chars, format: "BRAND Product Type Specification Size Quantity"
- category_ebay_id: eBay category ID (e.g., 42630 for fasteners)
- category_amazon: Amazon browse node
- bullet_points: Exactly 5 bullet points, each max 500 chars:
  1. Main feature/use case
  2. Technical specification
  3. Material and quality
  4. Compatibility/application
  5. Package contents/quantity
- search_terms: 10 relevant search keywords
- hs_code: Suggested customs HS code

Return ONLY valid JSON with this structure:
{
    "brand": "",
    "model": "",  
    "mpn": "",
    "ean": "",
    "product_name": "",
    "category": "",
    "description": "",
    "material": "",
    "color": "",
    "size": "",
    "din_iso": "",
    "country_of_origin": "",
    "certifications": [],
    "specifications": {},
    "quantity": "",
    "surface_treatment": "",
    "marketplace_suggestions": {
        "title": "",
        "category_ebay_id": "",
        "category_amazon": "",
        "bullet_points": [],
        "search_terms": [],
        "hs_code": ""
    }
}"""
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            "max_tokens": 500
        }
        
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code != 200:
            error_detail = response.json().get('error', {}).get('message', 'Unknown error')
            raise HTTPException(status_code=500, detail=f"OpenAI API error: {error_detail}")
        
        # Parse the response
        result = response.json()
        result_text = result['choices'][0]['message']['content'].strip()
        
        # Clean the response text (remove markdown code blocks if present)
        if result_text.startswith('```json'):
            result_text = result_text[7:]  # Remove ```json
        if result_text.startswith('```'):
            result_text = result_text[3:]  # Remove ```
        if result_text.endswith('```'):
            result_text = result_text[:-3]  # Remove trailing ```
        result_text = result_text.strip()
        
        # Try to parse as JSON
        try:
            analysis_result = json.loads(result_text)
        except json.JSONDecodeError:
            # If parsing still fails, try to extract JSON from the text
            import re
            json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
            if json_match:
                try:
                    analysis_result = json.loads(json_match.group())
                except:
                    # Last resort: create a structured response
                    analysis_result = {
                        "product_name": "Unknown",
                        "brand": "Unknown",
                        "category": "Unknown",
                        "description": result_text,
                        "barcode": None,
                        "quantity": None,
                        "additional_info": None
                    }
            else:
                analysis_result = {
                    "product_name": "Unknown",
                    "brand": "Unknown",
                    "category": "Unknown",
                    "description": result_text,
                    "barcode": None,
                    "quantity": None,
                    "additional_info": None
                }
        
        # Add metadata
        analysis_result.update({
            "image_id": image_id,
            "analyzed_at": datetime.now().isoformat(),
            "original_filename": image_info["original_filename"]
        })
        
        return analysis_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/api/images/{image_id}")
async def get_image_info(image_id: str):
    """Get information about an uploaded image."""
    if image_id not in uploaded_images:
        raise HTTPException(status_code=404, detail="Image not found")
    return uploaded_images[image_id]

@app.post("/api/batch-upload")
async def batch_upload(
    session_id: str = Form(...),
    product_group: str = Form(...),
    images: List[UploadFile] = File(...)
):
    """
    Upload multiple images for a single product group.
    Organized by session and product group for batch processing.
    """
    # Create session directory structure
    session_dir = UPLOAD_DIR / session_id
    group_dir = session_dir / f"product_{product_group}"
    group_dir.mkdir(parents=True, exist_ok=True)
    
    uploaded = []
    
    for image_file in images:
        # Validate file type
        file_extension = Path(image_file.filename).suffix.lower()
        if file_extension not in ALLOWED_EXTENSIONS:
            continue
        
        # Read and save file
        contents = await image_file.read()
        if len(contents) > MAX_FILE_SIZE:
            continue
        
        # Generate unique filename
        unique_id = str(uuid.uuid4())
        filename = f"{unique_id}{file_extension}"
        file_path = group_dir / filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            buffer.write(contents)
        
        # Store image info
        image_info = {
            "id": unique_id,
            "filename": filename,
            "original_filename": image_file.filename,
            "path": str(file_path),
            "session_id": session_id,
            "product_group": product_group,
            "size": len(contents),
            "uploaded_at": datetime.now().isoformat()
        }
        uploaded_images[unique_id] = image_info
        uploaded.append(image_info)
    
    # Optionally trigger AI analysis for the product group
    if uploaded and client_available:
        # Analyze first image to get product info
        first_image = uploaded[0]
        try:
            analysis = await analyze_image(first_image["id"])
            # Store analysis for the product group
            for img in uploaded:
                img["ai_analysis"] = analysis
        except:
            pass
    
    return {
        "session_id": session_id,
        "product_group": product_group,
        "uploaded_count": len(uploaded),
        "images": uploaded
    }

# Product CRUD Endpoints
@app.post("/api/products", response_model=schemas.Product)
async def create_product(
    product: schemas.ProductCreate,
    db: Session = Depends(get_db)
):
    """Create a new product"""
    # Check if barcode already exists
    if product.barcode:
        db_product = crud.get_product_by_barcode(db, product.barcode)
        if db_product:
            raise HTTPException(status_code=400, detail="Product with this barcode already exists")
    
    return crud.create_product(db, product)

@app.get("/api/products", response_model=List[schemas.Product])
async def list_products(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get list of products with optional filtering"""
    return crud.get_products(db, skip=skip, limit=limit, category=category, search=search)

@app.get("/api/products/{product_id}", response_model=schemas.Product)
async def get_product(
    product_id: UUID,
    db: Session = Depends(get_db)
):
    """Get a single product by ID"""
    db_product = crud.get_product(db, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@app.patch("/api/products/{product_id}", response_model=schemas.Product)
async def update_product(
    product_id: UUID,
    product: schemas.ProductUpdate,
    db: Session = Depends(get_db)
):
    """Update a product"""
    db_product = crud.update_product(db, product_id, product)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@app.delete("/api/products/{product_id}")
async def delete_product(
    product_id: UUID,
    db: Session = Depends(get_db)
):
    """Delete a product"""
    db_product = crud.delete_product(db, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

@app.patch("/api/products/{product_id}/metadata")
async def update_product_metadata(
    product_id: UUID,
    metadata: dict,
    db: Session = Depends(get_db)
):
    """Update product metadata (custom fields)"""
    db_product = crud.update_product_metadata(db, product_id, metadata)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@app.post("/api/products/from-analysis", response_model=schemas.Product)
async def create_product_from_analysis(
    image_id: str,
    additional_data: Optional[dict] = None,
    db: Session = Depends(get_db)
):
    """Create a product from AI analysis results"""
    # Get the analysis data from uploaded images
    if image_id not in uploaded_images:
        raise HTTPException(status_code=404, detail="Image analysis not found")
    
    image_info = uploaded_images[image_id]
    
    # Analyze the image first if not already done
    try:
        # Re-analyze or get existing analysis
        analysis = await analyze_image(image_id)
        
        # Create product from analysis
        product_data = schemas.ProductCreate(
            name=analysis.get("product_name", "Unknown Product"),
            barcode=analysis.get("barcode"),
            category=analysis.get("category"),
            brand=analysis.get("brand"),
            stock_quantity=0,
            ai_data=analysis,
            custom_fields=additional_data or {}
        )
        
        # Parse quantity if available
        if analysis.get("quantity"):
            try:
                qty = int(''.join(filter(str.isdigit, str(analysis["quantity"]))))
                product_data.stock_quantity = qty
            except:
                pass
        
        # Create the product
        db_product = crud.create_product(db, product_data)
        
        # Create product image record
        image_data = schemas.ProductImageCreate(
            product_id=db_product.id,
            filename=image_info["filename"],
            original_filename=image_info["original_filename"],
            file_path=image_info["path"],
            file_size=image_info["size"],
            is_primary=True
        )
        crud.create_product_image(db, image_data)
        
        return db_product
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create product: {str(e)}")

# Stock Movement Endpoints
@app.post("/api/products/{product_id}/stock-movements", response_model=schemas.StockMovement)
async def create_stock_movement(
    product_id: UUID,
    movement: schemas.StockMovementBase,
    db: Session = Depends(get_db)
):
    """Create a stock movement for a product"""
    # Check if product exists
    db_product = crud.get_product(db, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    movement_data = schemas.StockMovementCreate(
        product_id=product_id,
        **movement.dict()
    )
    return crud.create_stock_movement(db, movement_data)

@app.get("/api/products/{product_id}/stock-movements", response_model=List[schemas.StockMovement])
async def get_stock_movements(
    product_id: UUID,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Get stock movements for a product"""
    return crud.get_stock_movements(db, product_id, skip=skip, limit=limit)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
