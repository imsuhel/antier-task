import { Product } from '../../types';

export interface ProductsState {
  products: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  selectedCategory: string | null;
  searchQuery: string;
}

// Action types
export const FETCH_PRODUCTS = 'products/fetchProducts';
export const FETCH_CATEGORIES = 'products/fetchCategories';
export const SEARCH_PRODUCTS = 'products/searchProducts';
export const SET_SEARCH_QUERY = 'products/setSearchQuery';
export const SET_SELECTED_CATEGORY = 'products/setSelectedCategory';
