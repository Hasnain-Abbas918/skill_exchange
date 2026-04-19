import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchBids = createAsyncThunk('bids/fetchAll', async (params = {}) => {
  const res = await api.get('/bids', { params });
  return res.data;
});

export const createBid = createAsyncThunk('bids/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/bids', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteBid = createAsyncThunk('bids/delete', async (id) => {
  await api.delete(`/bids/${id}`);
  return id;
});

const bidSlice = createSlice({
  name: 'bids',
  initialState: { bids: [], total: 0, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBids.pending, (state) => { state.loading = true; })
      .addCase(fetchBids.fulfilled, (state, action) => { state.loading = false; state.bids = action.payload.bids; state.total = action.payload.total; })
      .addCase(fetchBids.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(createBid.fulfilled, (state, action) => { state.bids.unshift(action.payload); state.total += 1; })
      .addCase(deleteBid.fulfilled, (state, action) => { state.bids = state.bids.filter((b) => b.id !== action.payload); });
  },
});

export default bidSlice.reducer;