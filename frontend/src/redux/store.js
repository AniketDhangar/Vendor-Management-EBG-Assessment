import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import vendorReducer from './slices/vendorSlice';
import productReducer from './slices/productSlice';
import orderReducer from './slices/orderSlice';
import analyticsReducer from './slices/analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vendors: vendorReducer,
    products: productReducer,
    orders: orderReducer,
    analytics: analyticsReducer
  }
});
