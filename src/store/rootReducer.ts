import { combineReducers } from 'redux';

import authReducer from './modules/auth/slice';

export const rootReducer = combineReducers({
  auth: authReducer,
});
