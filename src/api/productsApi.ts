import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product } from '../types';

// Define our single API slice object
interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com' }),
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, { skip: number; limit: number }>({
      query: ({ skip = 0, limit = 20 }) => ({
        url: '/products',
        params: { skip, limit },
      }),
      // Only have one cache entry because the arg always maps to one string
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      // Always merge incoming data to the cache entry
      merge: (currentCache, newItems) => {
        currentCache.products.push(...newItems.products);
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.skip !== previousArg?.skip;
      },
    }),
    getProductById: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
    }),
    getProductsByCategory: builder.query<ProductsResponse, { category: string }>({
      query: ({ category }) => `/products/category/${encodeURIComponent(category)}`,
    }),
    searchProducts: builder.query<ProductsResponse, { q: string }>({
      query: ({ q }) => ({
        url: '/products/search',
        params: { q },
      }),
    }),
    getCategories: builder.query<string[], void>({
      query: () => '/products/categories',
    }),
  }),
});

// Export the auto-generated hooks for usage in functional components
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductsByCategoryQuery,
  useSearchProductsQuery,
  useGetCategoriesQuery,
} = productsApi;
