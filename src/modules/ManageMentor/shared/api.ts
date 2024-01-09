import { axiosInstanceV2 } from '@/shared/axios';

class MentorServices {
  async searchMentor(keyword: any) {
    const res = await axiosInstanceV2.get(`mentors/search?keyword=${keyword}`);
    return res.data;
  }
}

export const mentorServices = new MentorServices();
