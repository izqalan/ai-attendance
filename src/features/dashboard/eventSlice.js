/* eslint-disable prefer-destructuring */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AWS from 'aws-sdk';
import { isEmpty } from 'lodash';
import { supabase } from '../../supabase';
import config from '../../util/aws-config';

AWS.config.update({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  region: config.region,
});

const initialState = {
  events: null,
  event: {},
  success: false,
  isLoading: false,
  attendees: null,
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

export const fetchAttendees = createAsyncThunk(
  'EVENT/ATTENDEES',
  async ({ eventId }) => {
    try {
      const response = await supabase
        .from('UsersEvents')
        .select(`
          *,
          user:userId(*)
        `).eq('eventId', eventId)
        .order('createdAt', { ascending: true });
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

// capture user face but not saving attendance record to db yet
export const captureFace = createAsyncThunk(
  'EVENT/CAPTURE_FACE',
  async ({ imageSrc }) => {
    try {
      const rekognition = new AWS.Rekognition();
      let response = {};
      // eslint-disable-next-line new-cap
      const buffer = new Buffer.from(imageSrc.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      const rekognitionResponse = await rekognition.searchFacesByImage({
        CollectionId: 'uniten-faces',
        MaxFaces: 1,
        FaceMatchThreshold: 70,
        Image: {
          Bytes: buffer
        },
      }).promise();

      if (rekognitionResponse.FaceMatches.length > 0) {
        const detectedUserId = rekognitionResponse.FaceMatches[0].Face.ExternalImageId;
        response = await supabase
        .from('users')
        .select('*')
        .eq('id', detectedUserId)
        .limit(1)
        .single();
      } else if (rekognitionResponse.FaceMatches.length === 0) {
        response = {
          error: {
            type: 'NOFACE',
            message: 'No face detected'
          }
        };
      }
      return response;
    } catch (error) {
      return error;
    }
  }
);

// not sure why this cause infinite recursion
export const confirmAttendance = createAsyncThunk(
  'EVENT/CONFIRM_ATTENDANCE',
  async ({ eventId, userId }) => {
    try {
      const response = await supabase
        .from('UsersEvents')
        .insert([{ eventId, userId, isAttended: true }]);
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
      state.attendees = null;
      // state.currentAttendee = null;
    },
    appendAttendees: (state, action) => {
      state.attendees = state.attendees.concat(action.payload);
    }
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
      })
      .addCase(captureFace.fulfilled, (state, { payload }) => {
        const { error, data } = payload;
        if (error) {
          state.success = false;
          state.isLoading = false;
          state.currentAttendee = payload;
        } else {
          state.currentAttendee = data;
          state.success = true;
          state.isLoading = false;
        }
      })
      .addCase(captureFace.pending, (state) => {
        state.success = false;
        state.isLoading = true;
      })
      .addCase(captureFace.rejected, (state) => {
        state.success = false;
        state.isLoading = true;
      })
      .addCase(confirmAttendance.fulfilled, (state, { payload }) => {
        const { error, data } = payload;
        if (error) {
          state.success = false;
          state.isLoading = false;
        } else {
          state.data = data;
          state.success = true;
          state.isLoading = false;
        }
      })
      .addCase(confirmAttendance.pending, (state) => {
        state.success = false;
        state.isLoading = true;
      })
      .addCase(confirmAttendance.rejected, (state) => {
        state.success = false;
        state.isLoading = true;
      })
      .addCase(fetchAttendees.fulfilled, (state, { payload }) => {
        const { data } = payload;
        state.attendees = data;
      })
      .addCase(fetchAttendees.pending, (state) => {
        state.success = false;
        state.isLoading = true;
      })
      .addCase(fetchAttendees.rejected, (state) => {
        state.success = false;
        state.isLoading = true;
      });
  }
});

export const { appendAttendees, clearState } = eventSlice.actions;

export const selectEvents = (state) => state.event.events;
export const selectUserSuccess = (state) => state.event.success;
export const selectUserIsLoading = (state) => state.event.isLoading;
export const selectSingleEvent = (state) => state.event.event;
export const selectAttendees = (state) => state.event.attendees;
export const selectCurrentAttendee = (state) => state.event.currentAttendee;
export default eventSlice.reducer;
