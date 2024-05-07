import { axiosInstanceV4 } from '@/shared/axios';
import { IGetListLicenseReq, IGetListLicenseRes } from './interface';

class ManagerServiceService {
  addLicense = async (params: any) => {
    const { data } = await axiosInstanceV4.post('/license', params);
    return data;
  };

  // Search
  getAllLicense = async (page: number, pageSize: number, params: IGetListLicenseReq) => {
    const { data } = await axiosInstanceV4.post(
      `/licenses?Page=${page}&PageSize=${pageSize}`,
      params
    );
    return data;
  };

  getAllLicenseOrder = async (
    page: number,
    pageSize: number,
    params: IGetListLicenseRes
  ) => {
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

  updateLicenseOrder = async (params: any) => {
    const { data } = await axiosInstanceV4.put('/license-order', params);
    return data;
  };

  deleteLicenseOrder = async (id: any) => {
    const { data } = await axiosInstanceV4.delete('/license/DeleteOrder', {
      data: { id: id },
    });
    return data;
  };

  getLicenseCode = async (id: any) => {
    const { data } = await axiosInstanceV4.get(`/license-codes/${id}`);
    return data;
  };

  getLicenseCodeDetail = async (code: string) => {
    const { data } = await axiosInstanceV4.get(`/license/get/${code}`);
    return data;
  };

  getLicenseOrderDetail = async (id: string) => {
    const { data } = await axiosInstanceV4.get(`/license-order/${id}`);
    return data;
  };

  updateLicense = async (params: any) => {
    const { data } = await axiosInstanceV4.put('/license', params);
    return data;
  };
}

export const managerServiceService = new ManagerServiceService();
