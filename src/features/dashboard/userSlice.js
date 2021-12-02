/* eslint-disable no-console */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../../supabase';

const initialState = {
  auth: null,
  user: null,
  success: false,
  isLoading: false,
};

export const updateUserAuth = createAsyncThunk(
  'USER/UPDATE',
  async ({ accessToken, payload }) => {
    try {
      const response = await supabase.auth.api.updateUser(accessToken, payload);
      return response;
    } catch (error) {
      console.error('Error', error);
    }
  }
);

export const sendResetPasswordEmail = createAsyncThunk(
  'USER/RESET',
  async (email) => {
    try {
      const response = supabase.auth.api
        .resetPasswordForEmail(email);
      return response;
    } catch (error) {
      console.error('Error', error);
    }
  }
);

export const fetchUser = createAsyncThunk(
  'USER/FETCH',
  async () => {
    try {
      const response = await supabase.auth.user();
      return response;
    } catch (error) {
      console.error('Error', error);
    }
  }
);

export const userSlice = createSlice({
  name: 'USER',
  initialState,
  reducers: {
    clearState: (state) => {
      state.auth = null;
      state.success = false;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, { payload }) => {
        const { error } = payload;
        if (error) {
          state.success = false;
          state.isLoading = false;
        } else {
          state.user = payload;
          state.success = true;
          state.isLoading = false;
        }
      })
      .addCase(fetchUser.pending, (state) => {
        state.success = false;
        state.isLoading = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.success = false;
        state.isLoading = true;
      })
      .addCase(updateUserAuth.fulfilled, (state, { payload }) => {
        const { error, data } = payload;
        if (error) {
          state.success = false;
          state.isLoading = false;
        } else {
          state.auth = data;
          state.success = true;
          state.isLoading = false;
        }
      })
      .addCase(updateUserAuth.pending, (state) => {
        state.success = false;
        state.isLoading = true;
      })
      .addCase(updateUserAuth.rejected, (state) => {
        state.success = false;
        state.isLoading = true;
      })
      .addCase(sendResetPasswordEmail.fulfilled, (state, { payload }) => {
        const { error } = payload;
        if (error) {
          state.success = false;
          state.isLoading = false;
        } else {
          state.success = true;
          state.isLoading = false;
        }
      })
      .addCase(sendResetPasswordEmail.pending, (state) => {
        state.success = false;
        state.isLoading = true;
      })
      .addCase(sendResetPasswordEmail.rejected, (state) => {
        state.success = false;
        state.isLoading = true;
      });
  }
});

export const selectUser = (state) => state.user.auth;
export const selectUserData = (state) => state.user.user;
export const selectUserSuccess = (state) => state.user.success;
export const selectUserIsLoading = (state) => state.user.isLoading;

export default userSlice.reducer;
