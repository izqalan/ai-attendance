/* eslint-disable no-console */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../../supabase';

const initialState = {
  auth: null,
  user: null,
  success: false,
  isLoading: false,
  profile: null,
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
      return error;
    }
  }
);

export const updateUserName = createAsyncThunk(
  // update first and last name
  'USER/UPDATE_NAME',
  async ({ userId, payload }) => {
    try {
      const response = await supabase
        .from('users')
        .update({ firstname: payload.firstname, lastname: payload.lastname })
        .eq('id', userId);
      return response;
    } catch (error) {
      console.error('Error', error);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  // fetch first and last name
  'USER/FETCH_PROFILE',
  async (userId) => {
    try {
      const response = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
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
      .addCase(fetchUserProfile.fulfilled, (state, { payload }) => {
        const { error, data } = payload;
        if (error) {
          state.success = false;
          state.isLoading = false;
        } else {
          state.success = true;
          state.isLoading = false;
          state.profile = data;
        }
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.success = false;
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.success = false;
        state.isLoading = true;
      })
      .addCase(updateUserName.fulfilled, (state, { payload }) => {
        const { error, data } = payload;
        if (error) {
          state.success = false;
          state.isLoading = false;
        } else {
          state.success = true;
          state.isLoading = false;
          state.profile = {
            ...state.profile,
            firstname: data[0].firstname,
            lastname: data[0].lastname,
          };
        }
      })
      .addCase(updateUserName.pending, (state) => {
        state.success = false;
        state.isLoading = true;
      })
      .addCase(updateUserName.rejected, (state) => {
        state.success = false;
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, { payload }) => {
        try {
          const { error } = payload;
          if (error) {
            state.success = false;
            state.isLoading = false;
          } else {
            state.user = payload;
            state.success = true;
            state.isLoading = false;
          }
        } catch (error) {
          console.error('Error', error);
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
export const selectUserProfile = (state) => state.user.profile;

export default userSlice.reducer;
