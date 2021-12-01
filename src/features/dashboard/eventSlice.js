/* eslint-disable prefer-destructuring */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../../supabase';

const initialState = {
  events: null,
  event: {},
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

export const fetchEvents = createAsyncThunk(
  'EVENT/FETCHALL',
  async () => {
    try {
      const response = await supabase
        .from('events')
        .select(`
          *,
          user:userId(*)
        `);
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'EVENT/SINGLE',
  async ({ eventId }) => {
    try {
      const response = await supabase
        .from('events')
        .select(`
          *,
          user:userId(*)
        `).eq('id', eventId);
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
      .addCase(fetchEventById.fulfilled, (state, { payload }) => {
        const { error, data } = payload;
        if (error) {
          state.success = false;
          state.isLoading = false;
        } else {
          state.event = data[0];
          state.success = true;
          state.isLoading = false;
        }
      })
      .addCase(fetchEventById.pending, (state) => {
        state.success = false;
        state.isLoading = true;
      })
      .addCase(fetchEventById.rejected, (state) => {
        state.success = false;
        state.isLoading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, { payload }) => {
        const { error, data } = payload;
        if (error) {
          state.success = false;
          state.isLoading = false;
        } else {
          state.events = data;
          state.success = true;
          state.isLoading = false;
        }
      })
      .addCase(fetchEvents.pending, (state) => {
        state.success = false;
        state.isLoading = true;
      })
      .addCase(fetchEvents.rejected, (state) => {
        state.success = false;
        state.isLoading = true;
      })
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
export const selectSingleEvent = (state) => state.event.event;

export default eventSlice.reducer;
