import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
  rightSidebarOpen: boolean;
  mobileMenuOpen: boolean;
  commandPaletteOpen: boolean;
  globalSearchOpen: boolean;
  activeModal: string | null;
}

const initialState: UiState = {
  theme: 'dark',
  sidebarOpen: false,
  rightSidebarOpen: true,
  mobileMenuOpen: false,
  commandPaletteOpen: false,
  globalSearchOpen: false,
  activeModal: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<'dark' | 'light'>) {
      state.theme = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    toggleRightSidebar(state) {
      state.rightSidebarOpen = !state.rightSidebarOpen;
    },
    setRightSidebarOpen(state, action: PayloadAction<boolean>) {
      state.rightSidebarOpen = action.payload;
    },
    setMobileMenuOpen(state, action: PayloadAction<boolean>) {
      state.mobileMenuOpen = action.payload;
    },
    setCommandPaletteOpen(state, action: PayloadAction<boolean>) {
      state.commandPaletteOpen = action.payload;
    },
    setGlobalSearchOpen(state, action: PayloadAction<boolean>) {
      state.globalSearchOpen = action.payload;
    },
    setActiveModal(state, action: PayloadAction<string | null>) {
      state.activeModal = action.payload;
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  toggleRightSidebar,
  setRightSidebarOpen,
  setMobileMenuOpen,
  setCommandPaletteOpen,
  setGlobalSearchOpen,
  setActiveModal
} = uiSlice.actions;
export default uiSlice.reducer;
