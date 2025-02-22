import { axiosInstanceV4 } from '@/shared/axios';
import { IGetListLicenseReq } from './interface';

class ManagerServiceService {
  addLicense = async (params: any) => {
    const { data } = await axiosInstanceV4.post('/license', params);
    return data;
  };

  getAllLicense = async (page: number, pageSize: number, params: IGetListLicenseReq) => {
    const { data } = await axiosInstanceV4.post(
      `/licenses?Page=${page}&PageSize=${pageSize}`,
      params
    );
    return data;
  };

  getLicenseDetail = async (id: string) => {
    const { data } = await axiosInstanceV4.get(
      `${process.env.NEXT_PUBLIC_API_URL_V4}/license/${id}`
    );
    return data;
  };

  updateLicense = async (params: any) => {
    const { data } = await axiosInstanceV4.put('/license', params);
    return data;
  };
}

export const managerServiceService = new ManagerServiceService();
