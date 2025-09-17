import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isRefreshing: boolean;
  isSearching: boolean;
  isCategoryDropdownOpen: boolean;
  selectedProduct: any | null;
  isProductModalVisible: boolean;
}

const initialState: UIState = {
  isRefreshing: false,
  isSearching: false,
  isCategoryDropdownOpen: false,
  selectedProduct: null,
  isProductModalVisible: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.isRefreshing = action.payload;
    },
    setSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
    setCategoryDropdownOpen: (state, action: PayloadAction<boolean>) => {
      state.isCategoryDropdownOpen = action.payload;
    },
    setSelectedProduct: (state, action: PayloadAction<any | null>) => {
      state.selectedProduct = action.payload;
    },
    setProductModalVisible: (state, action: PayloadAction<boolean>) => {
      state.isProductModalVisible = action.payload;
    },
  },
});

export const {
  setRefreshing,
  setSearching,
  setCategoryDropdownOpen,
  setSelectedProduct,
  setProductModalVisible,
} = uiSlice.actions;

export default uiSlice.reducer;
