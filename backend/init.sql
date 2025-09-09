-- InventoScan Database Schema
-- Flexible product model with JSONB fields for extensibility

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Core required fields
  name VARCHAR(255) NOT NULL,
  barcode VARCHAR(50),
  category VARCHAR(100),
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  
  -- Optional standard fields
  brand VARCHAR(100),
  location VARCHAR(50),
  condition VARCHAR(20) CHECK (condition IN ('new', 'used', 'refurbished', 'damaged') OR condition IS NULL),
  purchase_price DECIMAL(10,2) CHECK (purchase_price >= 0 OR purchase_price IS NULL),
  selling_price DECIMAL(10,2) CHECK (selling_price >= 0 OR selling_price IS NULL),
  
  -- Flexible JSON fields for extensibility
  metadata JSONB DEFAULT '{}',  -- User-defined custom fields
  ai_data JSONB DEFAULT '{}',   -- AI analysis results
  
  -- System timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_products_barcode ON products(barcode) WHERE barcode IS NOT NULL;
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_metadata ON products USING GIN (metadata);
CREATE INDEX idx_products_ai_data ON products USING GIN (ai_data);

-- Images table for product photos
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255),
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(50),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);

-- Stock movements table for tracking inventory changes
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment', 'initial')),
  quantity INTEGER NOT NULL,
  reason VARCHAR(255),
  reference_number VARCHAR(100),
  notes TEXT,
  created_by VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_created_at ON stock_movements(created_at);

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

-- Sample data for testing (optional)
INSERT INTO products (name, barcode, category, stock_quantity, brand, metadata, ai_data)
VALUES 
  ('Sample Product', '1234567890', 'Electronics', 10, 'TestBrand', 
   '{"color": "black", "weight": "500g"}', 
   '{"detected_objects": ["product", "barcode"], "confidence": 0.95}')
ON CONFLICT DO NOTHING;