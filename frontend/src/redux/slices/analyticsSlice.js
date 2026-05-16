import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { analyticsService } from '../../services/analyticsService';

export const fetchTotals = createAsyncThunk('analytics/totals', async (_, { rejectWithValue }) => {
  try {
    const { data } = await analyticsService.totals();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load analytics');
  }
});

export const fetchMonthly = createAsyncThunk('analytics/monthly', async (months, { rejectWithValue }) => {
  try {
    const { data } = await analyticsService.monthly(months);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load revenue chart');
  }
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    totals: null,
    monthly: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotals.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTotals.fulfilled, (state, action) => {
        state.loading = false;
        state.totals = action.payload;
      })
      .addCase(fetchTotals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMonthly.fulfilled, (state, action) => {
        state.monthly = action.payload;
      });
  }
});

export default analyticsSlice.reducer;
