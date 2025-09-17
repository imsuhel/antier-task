import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { Product } from '../types';

const BASE_URL = 'https://dummyjson.com';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // You can add auth token here if needed
    // const token = getToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return the data directly since we'll handle the response in each method
    return response;
  },
  (error: AxiosError) => {
    // Handle errors globally
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.data);
      console.error('Status code:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Define API response types
interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// API methods
export const getProducts = async (page: number = 0, limit: number = 10, category?: string): Promise<Product[]> => {
  try {
    let url = `/products?limit=${limit}&skip=${page * limit}`;
    if (category) {
      url = `/products/category/${category}?limit=${limit}&skip=${page * limit}`;
    }
    const response = await apiClient.get<ProductsResponse>(url);
    return response.data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data as Product;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get<string[]>('/products/categories');
    return response.data as string[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getProductsByCategory = async (category: string): Promise<{ products: Product[] }> => {
  try {
    const response = await apiClient.get<ProductsResponse>(`/products/category/${category}`);
    return { products: response.data.products || [] };
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    throw error;
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const response = await apiClient.get<ProductsResponse>(
      `/products/search?q=${encodeURIComponent(query)}`
    );
    return response.data.products || [];
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

export default apiClient;
