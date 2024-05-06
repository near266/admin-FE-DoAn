import { createSlice } from '@reduxjs/toolkit';
import { userLogin } from '@/shared/services';
import { IAuthState } from './types';
import App from 'next/app';
import { appLibrary } from '@/shared/utils/loading';
const userToken =
  typeof localStorage !== 'undefined' ? localStorage.getItem('jwtToken') : null;

const loginInitialState = {
  jwtToken: null,
  data: null,
  refreshToken: null,
  succeeded: false,
  loading: true,
};
const LoginSlice = createSlice({
  name: 'Login',
  initialState: loginInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // login user
      .addCase(userLogin.pending, (state) => {
        state.data = null;
        state.succeeded = null;
        state.loading = true;
      })
      .addCase(userLogin.fulfilled, (state, { payload }) => {
        state.data = payload.data;
        state.jwtToken = payload.data.jwtToken;
        state.succeeded = payload.succeeded;
        state.loading = false;
      })
      .addCase(userLogin.rejected, (state, { payload }) => {
        state.loading = false;
        state.succeeded = false;
      });
    // Add reducers for other actions if needed
  },
});

export default LoginSlice.reducer;
