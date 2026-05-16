import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { vendorService } from '../../services/vendorService';

export const fetchVendors = createAsyncThunk('vendors/list', async (params, { rejectWithValue }) => {
  try {
    const { data } = await vendorService.list(params);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load vendors');
  }
});

export const createVendor = createAsyncThunk('vendors/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await vendorService.create(payload);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create vendor');
  }
});

const vendorSlice = createSlice({
  name: 'vendors',
  initialState: { items: [], total: 0, page: 1, limit: 10, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendors.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createVendor.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.total += 1;
      });
  }
});

export default vendorSlice.reducer;
