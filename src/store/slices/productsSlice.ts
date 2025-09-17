import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types';

interface ProductsState {
  allProducts: Product[];
  productsByCategory: Record<string, Product[]>;
  categories: string[];
  selectedCategory: string | null;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
}

const initialState: ProductsState = {
  allProducts: [],
  productsByCategory: {},
  categories: [],
  selectedCategory: null,
  searchQuery: '',
  loading: false,
  error: null,
  currentPage: 0,
  hasMore: true,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
      state.currentPage = 0; // Reset pagination when category changes
      state.hasMore = true;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.selectedCategory = null; // Reset category when searching
      state.currentPage = 0;
      state.hasMore = true;
    },
    setProducts: (state, action: PayloadAction<{ products: Product[]; category: string | null }>) => {
      const { products, category } = action.payload;
      
      if (category) {
        // If we have a category, update products for that category
        state.productsByCategory[category] = products;
      } else {
        // If no category, these are the main products (ALL category)
        state.allProducts = products;
      }
    },
    appendProducts: (state, action: PayloadAction<{ products: Product[]; category: string | null }>) => {
      const { products, category } = action.payload;
      
      if (category) {
        // Append to existing category products
        state.productsByCategory[category] = [
          ...(state.productsByCategory[category] || []),
          ...products,
        ];
      } else {
        // Append to all products
        state.allProducts = [...state.allProducts, ...products];
      }
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    resetProducts: (state) => {
      state.allProducts = [];
      state.productsByCategory = {};
      state.currentPage = 0;
      state.hasMore = true;
    },
  },
});

export const {
  setLoading,
  setError,
  setCategories,
  setSelectedCategory,
  setSearchQuery,
  setProducts,
  appendProducts,
  setCurrentPage,
  setHasMore,
  resetProducts,
} = productsSlice.actions;

export default productsSlice.reducer;
