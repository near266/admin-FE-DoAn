// import { IGetListLicenseReq } from '@/pages/quan-ly-thanh-vien/doanh-nghiep/chinh-sua/[id]';
import { axiosInstanceV4 } from '@/shared/axios';
import { IGetListLicenseReq, IGetListLicenseRes } from './interface';

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

  getAllLicenseOrder = async (page: number, pageSize: number, params: IGetListLicenseRes) => {
    const { data } = await axiosInstanceV4.post(
      `/license-orders?Page=${page}&PageSize=${pageSize}`,
      params
    );
    return data;
  };

  getLicenseOrder = async (params: any) => {
    const { data } = await axiosInstanceV4.post('/license-order', params);
    return data;
  };

  getLicenseCode = async (id: any) => {
    const { data } = await axiosInstanceV4.get(`/license-codes/${id}`)
    return data;
  }

  getLicenseCodeDetail = async (code: string) => {
    const { data } = await axiosInstanceV4.get(`/license/get/${code}`)
    return data;
  }

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
