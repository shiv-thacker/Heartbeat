import { createSlice } from '@reduxjs/toolkit';

const threadSlice = createSlice({
  name: 'threads',
  initialState: {
    threads: [],
  },
  reducers: {
    addThread: (state, action) => {
      state.threads.unshift({
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    removeThread: (state, action) => {
      state.threads = state.threads.filter(thread => thread.id !== action.payload);
    },
    clearThreads: (state) => {
      state.threads = [];
    },
  },
});

export const { addThread, removeThread, clearThreads } = threadSlice.actions;
export default threadSlice.reducer;
