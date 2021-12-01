import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useToast } from '@chakra-ui/toast';
import { supabase } from '../../supabase';

const initialState = {
  events: null,
  success: false,
  isLoading: false,
};

export const createEvent = createAsyncThunk(
  'EVENT/CREATE',
  async (payload) => {
    try {
      const response = await supabase
        .from('events')
        .insert([payload]);
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const eventSlice = createSlice({
  name: 'EVENT',
  initialState,
  reducers: {
    clearState: (state) => {
      state.events = null;
      state.success = false;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEvent.fulfilled, (state, { payload }) => {
        const { error } = payload;
        if (error) {
          state.success = false;
          state.isLoading = false;
        } else {
          state.success = true;
          state.isLoading = false;
        }
      })
      .addCase(createEvent.pending, (state) => {
        state.success = false;
        state.isLoading = true;
      })
      .addCase(createEvent.rejected, (state) => {
        state.success = false;
        state.isLoading = true;
      });
  }
});

export const selectEvents = (state) => state.event.events;
export const selectUserSuccess = (state) => state.event.success;
export const selectUserIsLoading = (state) => state.event.isLoading;

export default eventSlice.reducer;
