import { combineReducers } from 'redux';

import authReducer from './modules/auth/slice';
import logihReducer from './modules/auth/loginSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  login: logihReducer,
});
