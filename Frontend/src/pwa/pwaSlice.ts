import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PwaState {
  isOnline: boolean;
  canInstall: boolean;
  isInstalled: boolean;
  updateAvailable: boolean;
}

const getOnlineState = () => typeof navigator === "undefined" || navigator.onLine;

const initialState: PwaState = {
  isOnline: getOnlineState(),
  canInstall: false,
  isInstalled: typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches,
  updateAvailable: false,
};

const pwaSlice = createSlice({
  name: "pwa",
  initialState,
  reducers: {
    setOnline: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setCanInstall: (state, action: PayloadAction<boolean>) => {
      state.canInstall = action.payload;
    },
    setInstalled: (state, action: PayloadAction<boolean>) => {
      state.isInstalled = action.payload;
    },
    setUpdateAvailable: (state, action: PayloadAction<boolean>) => {
      state.updateAvailable = action.payload;
    },
  },
});

export const { setOnline, setCanInstall, setInstalled, setUpdateAvailable } = pwaSlice.actions;
export default pwaSlice.reducer;
