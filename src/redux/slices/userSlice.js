import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    info: null, // Start with no user logged in
    loading: false,
    returnToSplash: false, // Flag to trigger return to splash with login
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
    triggerReturnToSplash(state) {
      state.returnToSplash = true;
    },
    resetReturnToSplash(state) {
      state.returnToSplash = false;
    },
    setTempEmail(state, action) {
      state.tempEmail = action.payload;
    },
  },
});

export const {
  setUser,
  logout,
  setLoading,
  triggerReturnToSplash,
  resetReturnToSplash,
  setTempEmail,
} = userSlice.actions;
export default userSlice.reducer;
