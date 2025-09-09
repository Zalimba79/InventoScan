-- InventoScan Marketplace-Optimized Database Schema
-- Complete schema for professional marketplace selling (eBay, Amazon, etc.)

-- Drop existing tables to recreate with new structure
DROP TABLE IF EXISTS stock_movements CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Main products table with complete marketplace fields
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- ========== IDENTIFICATION (Required for marketplaces) ==========
  ean VARCHAR(13),                         -- European Article Number (EAN-13/EAN-8)
  upc VARCHAR(12),                         -- Universal Product Code
  isbn VARCHAR(13),                        -- For books
  asin VARCHAR(10),                        -- Amazon Standard Identification Number
  mpn VARCHAR(100),                        -- Manufacturer Part Number
  sku VARCHAR(100) UNIQUE,                 -- Internal SKU
  
  -- ========== BASIC PRODUCT INFO ==========
  title VARCHAR(200) NOT NULL,             -- Product title (marketplace optimized)
  brand VARCHAR(100) NOT NULL,             -- Brand/Manufacturer (required by most marketplaces)
  model VARCHAR(100),                      -- Model number/name
  product_type VARCHAR(100),               -- Product type/category
  
  -- ========== PHYSICAL ATTRIBUTES (Required for shipping) ==========
  weight_kg DECIMAL(10,3),                 -- Weight in kilograms
  weight_unit VARCHAR(10) DEFAULT 'kg',    -- Weight unit (kg, g, lb, oz)
  length_cm DECIMAL(10,2),                 -- Length in centimeters
  width_cm DECIMAL(10,2),                  -- Width in centimeters
  height_cm DECIMAL(10,2),                 -- Height in centimeters
  dimension_unit VARCHAR(10) DEFAULT 'cm', -- Dimension unit (cm, mm, in)
  
  -- ========== DESCRIPTIONS & SEO ==========
  description_short TEXT,                  -- Short description (max 500 chars)
  description_html TEXT,                   -- Full HTML description for marketplaces
  bullet_points TEXT[],                    -- Array of bullet points (5-10 items)
  search_terms TEXT[],                     -- Search keywords/terms
  meta_title VARCHAR(200),                 -- SEO meta title
  meta_description VARCHAR(500),           -- SEO meta description
  
  -- ========== PRICING (Multi-channel) ==========
  cost_price DECIMAL(10,2),                -- Purchase/cost price
  price_regular DECIMAL(10,2),             -- Regular selling price
  price_ebay DECIMAL(10,2),                -- eBay specific price
  price_amazon DECIMAL(10,2),              -- Amazon specific price
  price_shop DECIMAL(10,2),                -- Own shop price
  price_minimum DECIMAL(10,2),             -- Minimum acceptable price
  vat_rate DECIMAL(5,2) DEFAULT 19.0,      -- VAT rate in percentage
  
  -- ========== INVENTORY ==========
  stock_quantity INTEGER DEFAULT 0,
  stock_location VARCHAR(100),
  stock_minimum INTEGER DEFAULT 0,         -- Minimum stock level alert
  stock_reserved INTEGER DEFAULT 0,        -- Reserved for pending orders
  
  -- ========== MARKETPLACE CATEGORIES ==========
  category_ebay VARCHAR(100),              -- eBay category ID
  category_amazon VARCHAR(100),            -- Amazon category/browse node
  category_google VARCHAR(200),            -- Google product category
  category_internal VARCHAR(100),          -- Internal category
  
  -- ========== COMPLIANCE & CUSTOMS ==========
  hs_code VARCHAR(15),                     -- Harmonized System Code for customs
  country_of_origin VARCHAR(2),            -- ISO country code (DE, CN, etc.)
  ce_marking BOOLEAN DEFAULT FALSE,        -- CE certification
  rohs_compliant BOOLEAN DEFAULT FALSE,    -- RoHS compliance
  reach_compliant BOOLEAN DEFAULT FALSE,   -- REACH compliance
  
  -- ========== PRODUCT ATTRIBUTES (Marketplace specific) ==========
  color VARCHAR(50),
  size VARCHAR(50),
  material VARCHAR(100),
  pattern VARCHAR(50),
  style VARCHAR(50),
  condition VARCHAR(20) DEFAULT 'new',     -- new, used, refurbished, damaged
  condition_notes TEXT,                    -- Detailed condition description
  
  -- ========== MANUFACTURER INFO ==========
  manufacturer VARCHAR(100),
  manufacturer_warranty VARCHAR(100),      -- Warranty period
  manufacture_date DATE,
  expiry_date DATE,
  
  -- ========== PACKAGE INFO (For shipping calculation) ==========
  package_weight_kg DECIMAL(10,3),         -- Total package weight
  package_length_cm DECIMAL(10,2),
  package_width_cm DECIMAL(10,2),
  package_height_cm DECIMAL(10,2),
  units_per_package INTEGER DEFAULT 1,
  
  -- ========== LISTING STATUS ==========
  status VARCHAR(20) DEFAULT 'draft',      -- draft, active, inactive, out_of_stock
  listed_on_ebay BOOLEAN DEFAULT FALSE,
  listed_on_amazon BOOLEAN DEFAULT FALSE,
  ebay_item_id VARCHAR(50),                -- eBay listing ID
  amazon_listing_id VARCHAR(50),           -- Amazon listing ID
  
  -- ========== IMAGES (JSON structure) ==========
  images JSONB DEFAULT '{}',               -- {main: url, gallery: [urls], ebay: [urls], amazon: [urls]}
  
  -- ========== FLEXIBLE FIELDS ==========
  specifications JSONB DEFAULT '{}',       -- Technical specifications
  attributes JSONB DEFAULT '{}',           -- Additional attributes
  marketplace_data JSONB DEFAULT '{}',     -- Marketplace-specific data
  ai_suggestions JSONB DEFAULT '{}',       -- AI-generated suggestions
  
  -- ========== SYSTEM FIELDS ==========
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(100),
  updated_by VARCHAR(100)
);

-- Indexes for performance
CREATE INDEX idx_products_ean ON products(ean) WHERE ean IS NOT NULL;
CREATE INDEX idx_products_mpn ON products(mpn) WHERE mpn IS NOT NULL;
CREATE INDEX idx_products_sku ON products(sku) WHERE sku IS NOT NULL;
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_title ON products(title);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category_ebay ON products(category_ebay);
CREATE INDEX idx_products_category_amazon ON products(category_amazon);
CREATE INDEX idx_products_specifications ON products USING GIN (specifications);
CREATE INDEX idx_products_attributes ON products USING GIN (attributes);

-- Full text search index
CREATE INDEX idx_products_search ON products USING GIN (
  to_tsvector('english', 
    COALESCE(title, '') || ' ' || 
    COALESCE(brand, '') || ' ' || 
    COALESCE(description_short, '') || ' ' ||
    COALESCE(array_to_string(bullet_points, ' '), '')
  )
);

-- Product images table (separate for better management)
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_type VARCHAR(20) NOT NULL,         -- main, gallery, ebay, amazon, technical
  image_url VARCHAR(500),
  file_path VARCHAR(500),
  file_size INTEGER,
  width_px INTEGER,
  height_px INTEGER,
  alt_text VARCHAR(200),
  position INTEGER DEFAULT 0,              -- Sort order
  is_primary BOOLEAN DEFAULT FALSE,
  marketplace_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_type ON product_images(image_type);

-- Stock movements (unchanged but included for completeness)
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  movement_type VARCHAR(20) NOT NULL,
  quantity INTEGER NOT NULL,
  reason VARCHAR(255),
  reference_number VARCHAR(100),
  order_id VARCHAR(100),
  marketplace VARCHAR(50),
  notes TEXT,
  created_by VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_created_at ON stock_movements(created_at);

-- Marketplace listing history
CREATE TABLE IF NOT EXISTS listing_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  marketplace VARCHAR(50) NOT NULL,        -- ebay, amazon, etc.
  action VARCHAR(50) NOT NULL,             -- created, updated, ended, sold
  listing_id VARCHAR(100),
  price DECIMAL(10,2),
  quantity INTEGER,
  response_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_listing_history_product_id ON listing_history(product_id);
CREATE INDEX idx_listing_history_marketplace ON listing_history(marketplace);

-- Trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE
ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample marketplace-ready product
INSERT INTO products (
  ean, mpn, sku, title, brand, model,
  weight_kg, length_cm, width_cm, height_cm,
  description_short, bullet_points,
  price_regular, price_ebay, price_amazon,
  stock_quantity, category_ebay, category_amazon,
  hs_code, country_of_origin, status
) VALUES (
  '4047376706309', 
  '0948-32-04',
  'WUR-0948-32-04',
  'WÜRTH Einnietmutter Senkkopf M4 Stahl verzinkt 100 Stück',
  'WÜRTH',
  '0948 32 04',
  0.250, 10.0, 8.0, 3.0,
  'Hochwertige Einnietmutter mit Senkkopf für sichere Gewindeverbindungen in dünnen Materialien.',
  ARRAY[
    'Gewinde: M4 - für Standard M4 Schrauben',
    'Material: Stahl verzinkt blau passiviert (A2K)',
    'Klemmbereich: 1,5-3,5mm für verschiedene Materialstärken',
    'Bohrdurchmesser: 6,1mm für einfache Montage',
    'Lieferumfang: 100 Stück im praktischen Kunststoffbehälter'
  ],
  45.90, 43.90, 46.90,
  100, '42630', 'B001ABC123',
  '7318159000', 'DE', 'active'
) ON CONFLICT DO NOTHING;