import { createSlice } from '@reduxjs/toolkit';

const initialState = { theme: 'light', modalOpen: false };

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action) { state.theme = action.payload; },
    openModal(state) { state.modalOpen = true; },
    closeModal(state) { state.modalOpen = false; },
  }
});

export const { setTheme, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;