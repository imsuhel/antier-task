// Product type definition
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  ProductDetail: {product: Product};
};

// Theme types
export interface Theme {
  colors: {
    background: string;
    surface: string;
    primary: string;
    primaryVariant: string;
    secondary: string;
    error: string;
    onBackground: string;
    onSurface: string;
    onPrimary: string;
    onSecondary: string;
    onError: string;
    text: string;
    textSecondary: string;
    border: string;
    card: string;
    notification: string;
    disabled: string;
  };
  spacing: {
    xs: number;
    s: number;
    m: number;
    l: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    s: number;
    m: number;
    l: number;
    xl: number;
  };
  typography: {
    h1: object;
    h2: object;
    h3: object;
    body: object;
    caption: object;
    button: object;
  };
}

export type Category = {
  name: string;
  slug: string;
  url: string;
};
