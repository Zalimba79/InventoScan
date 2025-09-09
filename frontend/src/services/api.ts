import { secureFetch } from '../utils/csrf';

const API_URL = import.meta.env.PROD 
  ? 'https://inventoscan.mindbit.net/api'
  : window.location.hostname === 'localhost' 
    ? 'http://localhost:8000'
    : `http://${window.location.hostname}:8000`;

// Product interface for marketplace
export interface MarketplaceProduct {
  id?: string;
  title: string;
  brand: string;
  mpn?: string;
  ean?: string;
  sku?: string;
  weight_kg?: number;
  length_cm?: number;
  width_cm?: number;
  height_cm?: number;
  cost_price?: number;
  price_regular?: number;
  price_ebay?: number;
  price_amazon?: number;
  description_short?: string;
  bullet_points?: string[];
  search_terms?: string[];
  category_ebay?: string;
  category_amazon?: string;
  hs_code?: string;
  country_of_origin?: string;
  ai_suggestions?: any;
}

export const uploadImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await secureFetch(`${API_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Upload failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await secureFetch(`${API_URL}/api/health`);
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
};

export const analyzeImage = async (imageId: string) => {
  try {
    const response = await secureFetch(`${API_URL}/api/analyze/${imageId}`, {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Analysis failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
};

// Marketplace API functions
export const createMarketplaceProduct = async (product: MarketplaceProduct) => {
  try {
    const response = await secureFetch(`${API_URL}/api/marketplace/products/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create product');
    }

    return await response.json();
  } catch (error) {
    console.error('Create product error:', error);
    throw error;
  }
};

export const validateProductForMarketplace = async (productId: string, marketplace: string) => {
  try {
    const response = await secureFetch(
      `${API_URL}/api/marketplace/products/${productId}/validate?marketplace=${marketplace}`
    );

    if (!response.ok) {
      throw new Error('Validation failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Validation error:', error);
    throw error;
  }
};

export const exportProductForMarketplace = async (productId: string, marketplace: string, format: string = 'csv') => {
  try {
    const response = await secureFetch(
      `${API_URL}/api/marketplace/export/${marketplace}/${productId}?format=${format}`
    );

    if (!response.ok) {
      throw new Error('Export failed');
    }

    // If CSV format, download the file
    if (format === 'csv') {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${marketplace}_export.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      return { success: true };
    }

    return await response.json();
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
};

export const getMarketplaceCategories = async (marketplace: string) => {
  try {
    const response = await secureFetch(`${API_URL}/api/marketplace/categories/${marketplace}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return await response.json();
  } catch (error) {
    console.error('Categories error:', error);
    throw error;
  }
};

// Inventory API functions
export interface Product {
  id: string;
  name: string;
  brand: string;
  barcode?: string;
  category?: string;
  stock_quantity: number;
  location?: string;
  price_regular?: number;
  price_cost?: number;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at?: string;
  min_stock?: number;
}

export const getProducts = async (params?: {
  search?: string;
  category?: string;
  location?: string;
  low_stock?: boolean;
  skip?: number;
  limit?: number;
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const response = await secureFetch(`${API_URL}/api/inventory/products?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return await response.json();
  } catch (error) {
    console.error('Products error:', error);
    throw error;
  }
};

export const getProduct = async (productId: string) => {
  try {
    const response = await secureFetch(`${API_URL}/api/inventory/products/${productId}`);
    
    if (!response.ok) {
      throw new Error('Product not found');
    }

    return await response.json();
  } catch (error) {
    console.error('Product error:', error);
    throw error;
  }
};

export const getDashboardStats = async (timeRange: 'week' | 'month' | 'year' = 'month') => {
  try {
    const response = await secureFetch(`${API_URL}/api/inventory/dashboard/stats?time_range=${timeRange}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Dashboard stats error:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await secureFetch(`${API_URL}/api/inventory/categories`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return await response.json();
  } catch (error) {
    console.error('Categories error:', error);
    throw error;
  }
};

export const getLocations = async () => {
  try {
    const response = await secureFetch(`${API_URL}/api/inventory/locations`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }

    return await response.json();
  } catch (error) {
    console.error('Locations error:', error);
    throw error;
  }
};