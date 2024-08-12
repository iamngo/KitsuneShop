// store/counterSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface CounterState {
  quantity: number;
}

const initialState: CounterState = {
  quantity: 0,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state) {
      state.quantity += 1;
    },
    decrement(state) {
      state.quantity -= 1;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;

export default counterSlice.reducer;
