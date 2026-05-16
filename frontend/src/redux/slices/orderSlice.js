import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '../../services/orderService';

export const fetchOrders = createAsyncThunk('orders/list', async (params, { rejectWithValue }) => {
  try {
    const { data } = await orderService.list(params);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load orders');
  }
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const { data } = await orderService.updateStatus(id, status);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update order');
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: { items: [], total: 0, page: 1, limit: 10, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.items.findIndex((o) => o._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  }
});

export default orderSlice.reducer;
