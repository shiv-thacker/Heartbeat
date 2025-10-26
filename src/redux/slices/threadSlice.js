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
    addReaction: (state, action) => {
      const { threadId, reaction } = action.payload;
      const thread = state.threads.find(t => t.id === threadId);
      if (thread) {
        if (!thread.reactions) {
          thread.reactions = [];
        }
        thread.reactions.push({
          id: Date.now().toString(),
          emoji: reaction,
          userId: 'user1', // You can get this from auth state
          timestamp: new Date().toISOString(),
        });
      }
    },
  },
});

export const { addThread, removeThread, clearThreads, addReaction } = threadSlice.actions;
export default threadSlice.reducer;
