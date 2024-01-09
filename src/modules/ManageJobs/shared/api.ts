import axios from 'axios';
import { axiosInstanceEnterprise } from '@/shared/axios';
import ICareer from '@/interfaces/models/ICareer';
import { IField } from '@/interfaces/models/IField';
import { IServerResponse } from '@/interfaces/server/IServerResponse';
import { IRecruitment } from '@/interfaces/models/IRecruitment';
import { JOBS_STATUS_NUMERIC, SORT_DIRECTION } from './enum';

export type TStatusUpdate = {
  status: JOBS_STATUS_NUMERIC;
  reason_of_reject?: string;
};

export type TStatusUpdatePost = {
  status_id: JOBS_STATUS_NUMERIC;
  reason_of_rejection: string;
};

class JobService {
  getFields = async () => {
    const { data } = await axiosInstanceEnterprise.get('/career-fields');
    return data.data as IField[];
  };

  getCareers = async (keyword?: string) => {
    const { data } = await axiosInstanceEnterprise.get(
      `/careers?search=${keyword ?? ''}`
    );
    return data.data as ICareer[];
  };
  async getAllEnterprise() {
    const res = await axiosInstanceEnterprise.get(
      `${process.env.NEXT_PUBLIC_ENTERPRISE_API_URL}/enterprises?page=1&size=10`
    );
    return res.data;
  }

  async getAllTags() {
    const { data } = await axiosInstanceEnterprise.get(
      `${process.env.NEXT_PUBLIC_ENTERPRISE_API_URL}/tags`
    );
    return data.data;
  }

  async getAllEnterprisebyPage(
    page: number,
    sort_direction: SORT_DIRECTION,
    search_string?: string
  ) {
    let search_query = '';
    if (search_string !== null && search_string !== '') {
      search_query = `&search=${search_string}`;
    }
    const res = await axiosInstanceEnterprise.get(
      `${process.env.NEXT_PUBLIC_ENTERPRISE_API_URL}/enterprises?page=${page}&size=7&${sort_direction}${search_query}`
    );
    return res.data;
  }

  async getEnterprisesPostsbyPage(
    page: number,
    sort_direction: SORT_DIRECTION,
    search_string?: string
  ) {
    let search_query = '';
    if (search_string !== null && search_string !== '') {
      search_query = `&search=${search_string}`;
    }
    const res = await axiosInstanceEnterprise.get(
      `/list-job?page=${page}&size=5&${sort_direction}${search_query}`
    );
    return res.data.data;
  }

  async getEnterprisePostsbyPage(
    enterprise_id: string,
    page: number,
    sort_direction: SORT_DIRECTION
  ) {
    const res = await axiosInstanceEnterprise.get(
      `enterprises/${enterprise_id}/job-posts?page=${page}&size=7&${sort_direction}`
    );
    return res.data;
  }

  async getEnterpriseById(id: number | string) {
    const res = await axiosInstanceEnterprise.get(
      `${process.env.NEXT_PUBLIC_ENTERPRISE_API_URL}/enterprises/${id}`
    );
    return res.data;
  }

  async getEnterpriseLicense(id: number | string) {
    const res = await axiosInstanceEnterprise.get(
      `${process.env.NEXT_PUBLIC_ENTERPRISE_API_URL}/enterprises/${id}/business-license`
    );
    return res.data;
  }

  async getEnterprisePosts(id: number | string) {
    const res = await axiosInstanceEnterprise.get(
      `${process.env.NEXT_PUBLIC_ENTERPRISE_API_URL}/enterprises/${id}/job-posts`
    );
    return res.data;
  }

  updateRcruitment = async (id: string, params: IRecruitment | FormData) => {
    const { data } = await axiosInstanceEnterprise.post(`/update/${id}`, params);
    return data;
  };
  async deleteEnterprisePosts(id: number | string) {
    const res = await axiosInstanceEnterprise.delete(
      `${process.env.NEXT_PUBLIC_API_JOB_URL}/delete/${id}`
    );
    return res.data;
  }

  async getEnterpriseStatus(id: number | string) {
    const res = await axiosInstanceEnterprise.get(
      `${process.env.NEXT_PUBLIC_ENTERPRISE_API_URL}/enterprises/${id}/status`
    );
    return res.data;
  }

  async updateEnterpriseStatus(body: TStatusUpdate) {
    const res = await axiosInstanceEnterprise.put(
      `${process.env.NEXT_PUBLIC_API_ADMIN_URL}/update-account-enterprise`,
      body
    );
    return res.data;
  }

  async updateJobPostStatus(id: number | string, body: TStatusUpdate) {
    const res = await axiosInstanceEnterprise.put(
      `${process.env.NEXT_PUBLIC_API_ADMIN_URL}/update-status-post/${id}`,
      body
    );
    return res.data;
  }

  async fetchProvinces() {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_PROVINCES_API_URL}/p/`);
    return res.data;
  }

  async fetchDistricts(provinceCode: number) {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_PROVINCES_API_URL}/p/${provinceCode}?depth=2`
    );
    return res.data;
  }

  async fetchWards(districtCode: number) {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_PROVINCES_API_URL}/d/${districtCode}?depth=2`
    );
    return res.data;
  }
}

export const jobService = new JobService();
