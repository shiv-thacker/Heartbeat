import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    info: null, // Start with no user logged in
    loading: false,
    tempEmail: null, // Temporary storage for email during OTP flow
  },
  reducers: {
    setUser(state, action) {
      state.info = action.payload;
      state.tempEmail = null; // Clear temp email after login
    },
    logout(state) {
      state.info = null;
      state.tempEmail = null;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setTempEmail(state, action) {
      state.tempEmail = action.payload;
    },
  },
});

export const { setUser, logout, setLoading, setTempEmail } = userSlice.actions;
export default userSlice.reducer;
