/* eslint-disable no-console */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../../supabase';

const initialState = {
  data: null,
  success: false,
  isLoading: false,
};

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
  async (response) => {
    try {
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        const { error } = payload;
        if (error) {
          state.data = null;
          state.success = false;
          state.isLoading = false;
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
        console.log('payload', payload);
        const { error } = payload;
        if (error) {
          state.data = null;
          state.success = false;
          state.isLoading = false;
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

export const selectAuthData = (state) => state.auth.data;
export const selectAuthSuccess = (state) => state.auth.success;

export default authSlice.reducer;
