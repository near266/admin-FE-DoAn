import {
  AUTH_CHECK,
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_REFRESH_TOKEN,
  AUTH_RESET_PASSWORD,
  AUTH_SET_USER,
  AUTH_USER_UPDATE,
} from './actionTypes';

import { IAuthState } from './types';

const initialState: IAuthState = {
  isAuthenticated: false,
  isFetched: false,
  user: {},
};

const reducer = (state = initialState, { type, payload = null }) => {
  switch (type) {
    case AUTH_REFRESH_TOKEN:
    case AUTH_LOGIN:
      return login(state, payload);
    case AUTH_CHECK:
      return checkAuth(state, payload);
    case AUTH_LOGOUT:
      return logout(state);
    case AUTH_RESET_PASSWORD:
      return resetPassword(state);
    case AUTH_SET_USER:
      return setUser(state, payload);
    case AUTH_USER_UPDATE:
      return updateUser(state, payload);
    default:
      return state;
  }
};

function login(state, payload) {
  return {
    ...state,
    isAuthenticated: true,
  };
}

function checkAuth(state, payload) {
  return {
    ...state,
    isAuthenticated: payload.isAuthenticated,
    isFetched: payload.isFetched,
  };
}

function logout(state) {
  return {
    ...state,
    isAuthenticated: false,
    isFetched: true,
    user: {},
  };
}

function setUser(state, user) {
  return {
    ...state,
    isFetched: true,
    user: user,
  };
}

function updateUser(state, payload) {
  return {
    ...state,
    user: payload,
  };
}

function resetPassword(state) {
  return {
    ...state,
    resetPassword: true,
  };
}

export default reducer;
