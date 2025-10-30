import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isModalOpen: false,
  toast: {
    message: '',
    type: 'info', // 'info' | 'success' | 'error'
    isOpen: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Modal
    openModal(state) { state.isModalOpen = true; },
    closeModal(state) { state.isModalOpen = false; },
    // Toast
    showToast(state, action) {
      state.toast = {
        message: action.payload?.message || '',
        type: action.payload?.type || 'info',
        isOpen: true,
      };
    },
    hideToast(state) { state.toast.isOpen = false; },
    // Theme (optional)
    setTheme(state, action) { state.theme = action.payload; },
  }
});

export const { openModal, closeModal, showToast, hideToast, setTheme } = uiSlice.actions;
export default uiSlice.reducer;