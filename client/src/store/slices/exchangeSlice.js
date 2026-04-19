import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchExchanges = createAsyncThunk('exchanges/fetchAll', async () => {
  const res = await api.get('/exchanges');
  return res.data;
});

const exchangeSlice = createSlice({
  name: 'exchanges',
  initialState: { exchanges: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExchanges.pending, (state) => { state.loading = true; })
      .addCase(fetchExchanges.fulfilled, (state, action) => { state.loading = false; state.exchanges = action.payload; })
      .addCase(fetchExchanges.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  },
});

export default exchangeSlice.reducer;