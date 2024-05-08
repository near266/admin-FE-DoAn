import axios from 'axios';
import { apiVer1 } from './axios/apiv1';
class AdminAPI {
  async updateAccountAdmin(payload: any) {
    const res = await apiVer1.post('api/User/reset-password', payload);
    return res.data;
  }
}
export const AdminApi = new AdminAPI();
