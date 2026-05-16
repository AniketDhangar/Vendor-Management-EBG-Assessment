import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../../services/productService';

export const fetchProducts = createAsyncThunk('products/list', async (params, { rejectWithValue }) => {
  try {
    const { data } = await productService.list(params);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load products');
  }
});

export const createProduct = createAsyncThunk('products/create', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await productService.create(formData);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create product');
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: { items: [], total: 0, page: 1, limit: 10, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.total += 1;
      });
  }
});

export default productSlice.reducer;
