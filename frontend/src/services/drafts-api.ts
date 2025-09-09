import api from '../utils/secureApi';

const API_URL = import.meta.env.PROD 
  ? 'https://inventoscan.mindbit.net/api'
  : window.location.hostname === 'localhost' 
    ? 'http://localhost:8000'
    : `http://${window.location.hostname}:8000`;

/**
 * Product Draft API Service with CSRF Protection
 */

export interface ProductDraft {
  id: string;
  productCode: string;
  date: Date;
  images: string[];
  thumbnail: string;
  analyzed: boolean;
}

/**
 * Delete a product draft (with CSRF protection)
 */
export const deleteProductDraft = async (draftId: string): Promise<void> => {
  try {
    await api.delete(`${API_URL}/api/drafts/${draftId}`);
  } catch (error) {
    console.error('Delete draft error:', error);
    throw error;
  }
};

/**
 * Update a product draft (with CSRF protection)
 */
export const updateProductDraft = async (
  draftId: string, 
  updates: Partial<ProductDraft>
): Promise<ProductDraft> => {
  try {
    return await api.put<ProductDraft>(`${API_URL}/api/drafts/${draftId}`, updates);
  } catch (error) {
    console.error('Update draft error:', error);
    throw error;
  }
};

/**
 * Analyze selected product drafts (with CSRF protection)
 */
export const analyzeProductDrafts = async (draftIds: string[]): Promise<any> => {
  try {
    return await api.post(`${API_URL}/api/drafts/analyze`, { draft_ids: draftIds });
  } catch (error) {
    console.error('Analyze drafts error:', error);
    throw error;
  }
};

/**
 * Remove an image from a draft (with CSRF protection)
 */
export const removeImageFromDraft = async (
  draftId: string,
  imageUrl: string
): Promise<ProductDraft> => {
  try {
    return await api.delete<ProductDraft>(
      `${API_URL}/api/drafts/${draftId}/images`,
      { data: { image_url: imageUrl } } as any
    );
  } catch (error) {
    console.error('Remove image error:', error);
    throw error;
  }
};

/**
 * Get all product drafts (no CSRF needed for GET)
 */
export const getProductDrafts = async (): Promise<ProductDraft[]> => {
  try {
    return await api.get<ProductDraft[]>(`${API_URL}/api/drafts`);
  } catch (error) {
    console.error('Fetch drafts error:', error);
    throw error;
  }
};