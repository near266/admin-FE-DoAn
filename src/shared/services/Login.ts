import { createAsyncThunk } from '@reduxjs/toolkit';
import { Checkbox, Form, message } from 'antd';

import axios from 'axios';
interface UserLoginParams {
  email: string;
  password: string;
}

const userLogin = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: UserLoginParams,
    { rejectWithValue }: { rejectWithValue: any }
  ) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_LOCAL}/api/User/authenticate`,
        { email, password },
        config
      );
      localStorage.setItem('jwtToken', data.data.jwtToken);
      return data;
    } catch (error) {
      message.error('Sai email hoặc mật khẩu');
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
export default userLogin;
