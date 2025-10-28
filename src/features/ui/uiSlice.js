import { createSlice } from '@reduxjs/toolkit';

// State เริ่มต้นสำหรับ UI (Modal, Toast)
const initialState = {
  isModalOpen: false,
  toast: {
    message: '',
    type: 'info', // 'info', 'success', 'error'
    isOpen: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Reducer สำหรับเปิด/ปิด Modal
    openModal(state) {
      state.isModalOpen = true;
    },
    closeModal(state) {
      state.isModalOpen = false;
    },
    // Reducer สำหรับแสดง Toast
    showToast(state, action) {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type || 'info',
        isOpen: true,
      };
    },
    hideToast(state) {
      state.toast.isOpen = false;
    },
  },
});

// Export actions ให้เพื่อนๆ ไปยิง (dispatch)
export const { openModal, closeModal, showToast, hideToast } = uiSlice.actions;

// Export reducer ให้ store.js
export default uiSlice.reducer;

