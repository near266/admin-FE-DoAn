import { axiosInstanceV2 } from '@/shared/axios';
import { PayloadCreateField } from './utils';

class FieldService {
  // need login as admin to access this api
  async createField(field: any) {
    const res = await axiosInstanceV2.post('career-fields', field);
    return res.data;
  }

  async getAllFields() {
    const res = await axiosInstanceV2.get('career-fields?size=100');
    return res.data;
  }

  async getField(id: string) {
    const res = await axiosInstanceV2.get(`career-fields/${id}`);
    return res.data;
  }
  async updateField(id: number, field: any) {
    const res = await axiosInstanceV2.post(`career-fields/${id}`, field);
    return res.data;
  }
  async searchField(keyword: string) {
    const res = await axiosInstanceV2.put(`career-fields/search?keyword=${keyword}`);
    return res.data;
  }
  async deleteField(id: number) {
    const res = await axiosInstanceV2.delete(`career-fields/${id}`);
    return res.data;
  }
}

export const fieldService = new FieldService();
