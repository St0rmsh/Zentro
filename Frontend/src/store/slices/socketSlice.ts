import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SocketState {
  isConnected: boolean;
  connectionError: string | null;
}

const initialState: SocketState = {
  isConnected: false,
  connectionError: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
      if (action.payload) {
        state.connectionError = null;
      }
    },
    setConnectionError(state, action: PayloadAction<string | null>) {
      state.connectionError = action.payload;
      state.isConnected = false;
    },
  },
});

export const { setConnected, setConnectionError } = socketSlice.actions;
export default socketSlice.reducer;
