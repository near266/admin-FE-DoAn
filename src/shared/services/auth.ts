import { AxiosResponse } from 'axios';
import { axiosInstanceV1 } from '../axios';
import { clearCookies } from '../utils/common';

class AuthService {
  async currentUser() {
    const res = await axiosInstanceV1.get('auth/me');
    return res.data;
  }

  async updateMeInfo(params) {
    const res: AxiosResponse = await axiosInstanceV1.put('auth/update-info', params);
    return res.data;
  }

  async changePassword(params) {
    const res: AxiosResponse = await axiosInstanceV1.put('auth/change-password', params);
    return res.data;
  }

  async refreshToken() {
    const res = await axiosInstanceV1.post('auth/refresh-token', null, {
      withCredentials: true,
    });
    return res.data;
  }

  async logout() {
    const res = await axiosInstanceV1.post('auth/logout', null, {
      withCredentials: true,
    });
    clearCookies();
    return res.data;
  }
}

export const authService = new AuthService();
