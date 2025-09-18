import {Dispatch} from 'redux';
import {Product} from '../../types';

declare module '../store/actions/productActions' {
  export function fetchCategories(): any;
  export function fetchProducts(page: number, refresh: boolean): any;
  export function searchProducts(query: string): any;
  export function setSearchQuery(query: string): any;
  export function setSelectedCategory(category: string | null): any;
}
