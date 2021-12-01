/* eslint-disable import/no-named-as-default */
import { combineReducers } from 'redux';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/dashboard/userSlice';
import eventReducer from '../features/dashboard/eventSlice';

export const reducers = combineReducers({
  auth: authReducer,
  user: userReducer,
  event: eventReducer,
});
