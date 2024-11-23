import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createSheet } from './timesheetApi';

const initialState = {
  value: 0,
  status: 'idle',
};

export const incrementAsync = createAsyncThunk(
  'sheet/createSheet',
  async (amount) => {
    const response = await createSheet(amount);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const createSheetAsync = createAsyncThunk(
  'Sheet/createSheet',
  async (form) => {
    const response = await createSheet(form);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.value += action.payload;
      });
  },
});

export const { increment } = counterSlice.actions;

export const selectCount = (state) => state.counter.value;

export default counterSlice.reducer;