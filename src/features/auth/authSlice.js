/* eslint-disable no-console */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../../supabase';

const initialState = {
  data: null,
  success: false,
  isLoading: false,
  error: null,
};

const ATTENDEES_NOT_ALLOWED = 'Attendees are not allowed to access this page.';

export const loginUser = createAsyncThunk(
  'AUTH/LOGIN',
  async ({ email, password }) => {
    try {
      const response = await supabase.auth.signIn({ email, password });
      return response;
    } catch (error) {
      console.error('Error', error.response.data);
    }
  }
);

export const loginUserUsingProvider = createAsyncThunk(
  'AUTH/LOGIN_PROVIDER',
  async ({ provider }) => {
    try {
      const response = await supabase.auth.signIn({
        provider,
      });
      return response;
    } catch (error) {
      console.error('Error', error.response.data);
    }
  }
);

export const signUp = createAsyncThunk(
  'AUTH/SIGNUP',
  async ({ email, password }) => {
    try {
      await supabase.auth.signUp({ email, password });
    } catch (error) {
      console.error('Error', error.response.data);
    }
  }
);

export const logout = createAsyncThunk(
  'AUTH/LOGOUT',
  async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error', error.response.data);
    }
  }
);

export const authSlice = createSlice({
  name: 'AUTH',
  initialState,
  reducers: {
    clearState: (state) => {
      state.data = null;
      state.success = false;
      state.isLoading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        const { error, user } = payload;
        
        if (error) {
          state.data = null;
          state.success = false;
          state.isLoading = false;
        } else if (user.user_metadata.role === 'attendee') {
          state.data = null;
          state.success = false;
          state.isLoading = false;
          state.error = { message: ATTENDEES_NOT_ALLOWED };
        } else {
          state.data = payload;
          state.success = true;
          state.isLoading = false;
        }
      })
      .addCase(loginUser.pending, (state) => {
        state.success = false;
        state.isLoading = true;
      })
      .addCase(loginUser.rejected, (state) => {
        state.success = false;
        state.isLoading = false;
      })
      .addCase(loginUserUsingProvider.fulfilled, (state, { payload }) => {
        const { error, user } = payload;
        if (error) {
          state.data = null;
          state.success = false;
          state.isLoading = false;
        } else if (user.user_metadata.role === 'attendee') {
          state.data = null;
          state.success = false;
          state.isLoading = false;
          state.error = { message: ATTENDEES_NOT_ALLOWED };
        } else {
          state.data = payload;
          state.success = true;
          state.isLoading = false;
        }
      })
      .addCase(loginUserUsingProvider.pending, (state) => {
        state.success = false;
        state.isLoading = true;
      })
      .addCase(loginUserUsingProvider.rejected, (state) => {
        state.success = false;
        state.isLoading = false;
      })
      .addCase(signUp.fulfilled, (state) => {
        state.success = true;
        state.isLoading = false;
      })
      .addCase(signUp.pending, (state) => {
        state.success = false;
        state.isLoading = true;
      })
      .addCase(signUp.rejected, (state) => {
        state.success = false;
        state.isLoading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.data = null;
        state.success = true;
        state.isLoading = false;
      })
      .addCase(logout.pending, (state) => {
        state.success = false;
        state.isLoading = true;
      })
      .addCase(logout.rejected, (state) => {
        state.success = false;
        state.isLoading = false;
      })
      .addDefaultCase((state) => state);
  }
});

// export const { logout } = authSlice.actions;

export const { clearState, clearError } = authSlice.actions;

export const selectAuthData = (state) => state.auth.data;
export const selectAuthSuccess = (state) => state.auth.success;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
