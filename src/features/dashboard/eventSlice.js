/* eslint-disable prefer-destructuring */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AWS from 'aws-sdk';
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
        `).eq('eventId', eventId);
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

export const captureFace = createAsyncThunk(
  'EVENT/CAPTURE_FACE',
  async ({ eventId, imageSrc }) => {
    try {
      const rekognition = new AWS.Rekognition();
      // eslint-disable-next-line new-cap
      const buffer = new Buffer.from(imageSrc.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      let response = {};
      rekognition.searchFacesByImage({
        CollectionId: 'uniten-faces',
        FaceMatchThreshold: 70,
        Image: {
          Bytes: buffer
        },
        MaxFaces: 1,
      }, async (err, data) => {
        if (err) {
          response = {
            error: err,
          };
        }
        response = data;

        const detectedUserId = response.FaceMatches[0].Face.ExternalImageId;

        await supabase
          .from('UsersEvents')
          .insert([{ eventId, userId: detectedUserId, isAttended: true }]);
      });

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
      })
      .addCase(captureFace.fulfilled, (state, { payload }) => {
        const { error, data } = payload;
        if (error) {
          state.success = false;
          state.isLoading = false;
        } else {
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
      .addCase(fetchAttendees.fulfilled, (state, { payload }) => {
        const { error, data } = payload;
        console.log(data);
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

export const selectEvents = (state) => state.event.events;
export const selectUserSuccess = (state) => state.event.success;
export const selectUserIsLoading = (state) => state.event.isLoading;
export const selectSingleEvent = (state) => state.event.event;
export const selectAttendees = (state) => state.event.attendees;

export default eventSlice.reducer;
