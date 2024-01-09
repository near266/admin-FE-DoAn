import { IServerResponse } from '@/interfaces/server/IServerResponse';
import { axiosInstanceV2 } from '@/shared/axios';
import { PayloadCreateCareer } from './utils';

class CareerService {
  /* Need login */
  async createNewCareer(career: any) {
    const res = await axiosInstanceV2.post('/careers', career);
    return res.data;
  }
  async getAllCareers() {
    const res = await axiosInstanceV2.get('/careers?size=100');
    return res.data;
  }

  async getCareer(id: string) {
    const res = await axiosInstanceV2.get(`/careers/${id}`);
    return res.data as IServerResponse;
  }
  async updateCareer(id: number, career: any) {
    const res = await axiosInstanceV2.post(`/careers/${id}`, career);
    return res.data;
  }
  async searchCareer(keyword: string) {
    const res = await axiosInstanceV2.put(`/careers/search?keyword=${keyword}`);
    return res.data;
  }
  async deleteCareer(id: number) {
    const res = await axiosInstanceV2.delete(`/careers/${id}`);
    return res.data;
  }
}

export const careerService = new CareerService();
