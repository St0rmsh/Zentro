import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./authInitialState";
import {
  loginThunk,
  registerThunk,
  hydrateAuthThunk,
  logoutThunk,
  updateProfileThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
  changePasswordThunk,
  sendOtpThunk,
  verifyOtpThunk
} from "./authThunks";
import { User } from "@/shared/types/user.types";

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    resetAuth: (state) => {
      Object.assign(state, {
        ...initialState,
        isHydrating: false,
        hydrationCompleted: true,
        authChecked: true,
      });
    },
    setHydrationComplete: (state, action: PayloadAction<boolean>) => {
      state.hydrationCompleted = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.hydrationCompleted = true;
      state.authChecked = true;
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Register
    builder.addCase(registerThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerThunk.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.hydrationCompleted = false;
      state.authChecked = false;
    });
    builder.addCase(registerThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Current User
    builder.addCase(hydrateAuthThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.isHydrating = true;
    });
    builder.addCase(hydrateAuthThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isHydrating = false;
      state.hydrationCompleted = true;
      state.authChecked = true;
    });
    builder.addCase(hydrateAuthThunk.rejected, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.isHydrating = false;
      state.hydrationCompleted = true;
      state.authChecked = true;
    });

    // Logout
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.hydrationCompleted = true;
      state.authChecked = true;
    });

    // Update Profile
    builder.addCase(updateProfileThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProfileThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(updateProfileThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Other actions only handle loading/error states
    const genericThunks = [
      forgotPasswordThunk,
      resetPasswordThunk,
      changePasswordThunk,
      sendOtpThunk,
    ];

    genericThunks.forEach((thunk) => {
      builder.addCase(thunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(thunk.fulfilled, (state) => {
        state.loading = false;
      });
      builder.addCase(thunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    });

    // Verify OTP updates user
    builder.addCase(verifyOtpThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyOtpThunk.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.user = action.payload as User;
      } else if (state.user) {
        state.user.isEmailVerified = true;
      }
    });
    builder.addCase(verifyOtpThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, setAuthenticated, resetAuth, setHydrationComplete } = authSlice.actions;
export default authSlice.reducer;
