import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoadingState {
  globalLoading: boolean;
  operations: Record<string, boolean>;
}

const initialState: LoadingState = {
  globalLoading: true, // true by default for initial auth check
  operations: {},
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setGlobalLoading(state, action: PayloadAction<boolean>) {
      state.globalLoading = action.payload;
    },
    startOperation(state, action: PayloadAction<string>) {
      state.operations[action.payload] = true;
    },
    stopOperation(state, action: PayloadAction<string>) {
      state.operations[action.payload] = false;
    },
  },
});

export const { setGlobalLoading, startOperation, stopOperation } = loadingSlice.actions;
export default loadingSlice.reducer;
