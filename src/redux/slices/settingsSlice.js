import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    darkMode: false,
    notifications: true,
    biometric: false,
    language: 'en',
  },
  reducers: {
    setDarkMode(state, action) {
      state.darkMode = action.payload;
    },
    setNotifications(state, action) {
      state.notifications = action.payload;
    },
    setBiometric(state, action) {
      state.biometric = action.payload;
    },
    setLanguage(state, action) {
      state.language = action.payload;
    },
    resetSettings(state) {
      state.darkMode = false;
      state.notifications = true;
      state.biometric = false;
      state.language = 'en';
    },
  },
});

export const { setDarkMode, setNotifications, setBiometric, setLanguage, resetSettings } =
  settingsSlice.actions;

export default settingsSlice.reducer;
