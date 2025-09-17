import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getProducts as getProductsApi, 
  getProductsByCategory as getProductsByCategoryApi, 
  searchProducts as searchProductsApi,
  getCategories as getCategoriesApi,
  Product,
} from '../../api/apiClient';
import { AppDispatch, RootState } from '../store';
import { 
  setLoading, 
  setError, 
  setCategories, 
  setSelectedCategory, 
  setSearchQuery,
  setProducts,
  appendProducts,
  setCurrentPage,
  setHasMore,
  resetProducts
} from '../slices/productsSlice';
import { cacheData, getCachedData } from '../../utils/cache';

type ThunkApiConfig = {
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
};

// Helper function to handle errors
const handleError = (error: unknown): string => {
  return error instanceof Error ? error.message : 'An unknown error occurred';
};

// Helper function to get categories with cache
const getCategoriesWithCache = async (): Promise<string[]> => {
  const cacheKey = 'categories';
  
  // Try to get from cache first
  const cachedCategories = await getCachedData<string[]>(cacheKey);
  if (cachedCategories) {
    return cachedCategories;
  }
  
  // If not in cache, fetch from API
  const categories = await getCategoriesApi();
  
  // Cache the result
  await cacheData(cacheKey, categories);
  
  return categories;
};

// Thunk to fetch categories
export const fetchCategoriesAction = createAsyncThunk<string[], void, ThunkApiConfig>(
  'products/fetchCategories',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setLoading(true));
    try {
      const categories = await getCategoriesWithCache();
      dispatch(setCategories(categories));
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      const errorMessage = handleError(error);
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Helper function to get products with cache
const getProductsWithCache = async (page: number): Promise<Product[]> => {
  const cacheKey = `products_page_${page}`;
  
  // Try to get from cache first
  const cachedProducts = await getCachedData<Product[]>(cacheKey);
  if (cachedProducts) {
    return cachedProducts;
  }
  
  // If not in cache, fetch from API
  const products = await getProductsApi(page);
  
  // Cache the result
  await cacheData(cacheKey, products);
  
  return products;
};

// Thunk to fetch products with pagination
export const fetchProductsAction = createAsyncThunk<void, { page: number; refresh: boolean }, ThunkApiConfig>(
  'products/fetchProducts',
  async ({ page, refresh }, { dispatch, getState, rejectWithValue }) => {
    const state = getState();
    
    if (refresh) {
      dispatch(resetProducts());
    }
    
    dispatch(setLoading(true));
    
    try {
      // First try to get cached data for a better UX
      if (page === 0) {
        const cachedProducts = await getCachedData<Product[]>(`products_page_${page}`);
        if (cachedProducts) {
          dispatch(setProducts({ products: cachedProducts, category: null }));
        }
      }
      
      // Then fetch fresh data
      const newProducts = await getProductsWithCache(page);
      
      if (page === 0 || refresh) {
        dispatch(setProducts({ products: newProducts, category: null }));
      } else {
        dispatch(appendProducts({ products: newProducts, category: null }));
      }
      
      dispatch(setCurrentPage(page));
      dispatch(setHasMore(newProducts.length > 0));
    } catch (error) {
      console.error('Error fetching products:', error);
      const errorMessage = handleError(error);
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Helper function to get products by category with cache
const getProductsByCategoryWithCache = async (category: string): Promise<{ products: Product[] }> => {
  const cacheKey = `category_${category.toLowerCase()}`;
  
  // Try to get from cache first
  const cachedProducts = await getCachedData<{ products: Product[] }>(cacheKey);
  if (cachedProducts) {
    return cachedProducts;
  }
  
  // If not in cache, fetch from API
  const response = await getProductsByCategoryApi(category);
  
  // Cache the result
  await cacheData(cacheKey, response);
  
  return response;
};

// Thunk to fetch products by category
export const fetchProductsByCategoryAction = createAsyncThunk<void, string, ThunkApiConfig>(
  'products/fetchProductsByCategory',
  async (category, { dispatch, rejectWithValue }) => {
    dispatch(setLoading(true));
    dispatch(setSelectedCategory(category));
    
    try {
      // First try to get cached data for a better UX
      const cachedResponse = await getCachedData<{ products: Product[] }>(`category_${category.toLowerCase()}`);
      if (cachedResponse) {
        dispatch(setProducts({ products: cachedResponse.products, category }));
      }
      
      // Then fetch fresh data
      const response = await getProductsByCategoryWithCache(category);
      dispatch(setProducts({ products: response.products, category }));
    } catch (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      const errorMessage = handleError(error);
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Helper function to search products with cache
const searchProductsWithCache = async (query: string): Promise<Product[]> => {
  const cacheKey = `search_${query.toLowerCase()}`;
  
  // For search, we might want to have a shorter cache time or no cache at all
  // But we'll implement a basic cache for demonstration
  const cachedResults = await getCachedData<Product[]>(cacheKey);
  if (cachedResults) {
    return cachedResults;
  }
  
  const products = await searchProductsApi(query);
  
  // Cache the search results with a shorter expiry (not shown in this example)
  await cacheData(cacheKey, products);
  
  return products;
};

// Thunk to search products
export const searchProductsAction = createAsyncThunk<void, string, ThunkApiConfig>(
  'products/searchProducts',
  async (query, { dispatch, rejectWithValue }) => {
    dispatch(setLoading(true));
    
    try {
      if (!query.trim()) {
        await dispatch(fetchProductsAction({ page: 0, refresh: true }));
        return;
      }
      
      // First try to get cached results for a better UX
      const cachedResults = await getCachedData<Product[]>(`search_${query.toLowerCase()}`);
      if (cachedResults) {
        dispatch(setProducts({ products: cachedResults, category: null }));
        dispatch(setSearchQuery(query));
        dispatch(setHasMore(false));
      }
      
      // Then fetch fresh results
      const products = await searchProductsWithCache(query);
      
      dispatch(setProducts({ products, category: null }));
      dispatch(setSearchQuery(query));
      dispatch(setHasMore(false)); // No pagination for search results
    } catch (error) {
      console.error('Error searching products:', error);
      const errorMessage = handleError(error);
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Thunk to refresh all data
export const refreshDataAction = createAsyncThunk<void, void, ThunkApiConfig>(
  'products/refreshData',
  async (_, { dispatch, getState }) => {
    const { products } = getState();
    const { selectedCategory, searchQuery } = products;
    
    try {
      if (searchQuery) {
        await dispatch(searchProductsAction(searchQuery));
      } else if (selectedCategory) {
        await dispatch(fetchProductsByCategoryAction(selectedCategory));
      } else {
        await dispatch(fetchProductsAction({ page: 0, refresh: true }));
      }
      
      await dispatch(fetchCategoriesAction());
    } catch (error) {
      const errorMessage = handleError(error);
      dispatch(setError(errorMessage));
      throw error;
    }
  }
);
