import { axiosInstanceV4 } from '@/shared/axios';

class ManagerServiceService {
  addLicense = async (params: any | FormData) => {
    const { data } = await axiosInstanceV4.post('/license', params);
    return data;
  };
}

export const managerServiceService = new ManagerServiceService();
