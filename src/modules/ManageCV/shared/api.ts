import { axiosInstanceV2 } from '@/shared/axios';
import { axiosInstanceV4 } from '@/shared/axios';
import { AssessmentTypeNumeric } from '@/shared/enums/enums';
import { ROW_PERPAGE } from './constance';
import { PayloadAssessment } from './utils';
import { IGetListLicenseRes } from './interface';

class AssessmentService {
  /* Do not login */
  async getAssessmentFree(slug) {
    const res = await axiosInstanceV2.get(`assessments-free/${slug}`);
    return res.data;
  }
  async getAllAssessments() {
    const res = await axiosInstanceV2.get('assessments');
    return res.data;
  }

  getListCV = async (params: IGetListLicenseRes) => {
    const { data } = await axiosInstanceV4.post('/Admin/SearchCandidatesAdmin', {rq: params});
    return data;
  };

  /* Need login */

  async getAssessmentInfo(slug) {
    const res = await axiosInstanceV2.get(`assessments/${slug}`);
    return res.data;
  }

  async getQuestionTypesById(id) {
    const res = await axiosInstanceV2.get(`question-types?assessment_id=${id}`);
    return res.data;
  }
  async getPrivilege(slug) {
    const res = await axiosInstanceV2.get(`access-assessment/${slug}`);
    return res.data;
  }

  async getAssessmentResult(slug) {
    const res = await axiosInstanceV2.get(`get-assessment-test-result/${slug}`);
    return res.data;
  }

  async getAssessmentResultByUserId(userId: string, slug: string) {
    const res = await axiosInstanceV2.get(
      `assessments/result?user_id=${userId}&slug=${slug}`
    );
    return res.data;
  }
  async getTestLevels(id) {
    const res = await axiosInstanceV2.get(`test-levels?id=${id}`);
    return res.data;
  }

  async getSummitedAssessment(type: AssessmentTypeNumeric, page?: number) {
    const res = await axiosInstanceV2.get(
      `assessments/submitted?type=${type}&size=${ROW_PERPAGE}&page=${page}`
    );
    return res.data;
  }

  async createNewAssessment(assessment: any) {
    const res = await axiosInstanceV2.post('assessments', assessment);
    return res.data;
  }

  async updateNewAssessment(id, assessment: any) {
    const res = await axiosInstanceV2.post(`assessments/${id}`, assessment, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    });
    return res.data;
  }
  async updateNewAssessmentStatus(id, status: { status: string }) {
    const res = await axiosInstanceV2.put(`assessments/${id}/status`, status);
    return res.data;
  }
  async updateAssessmentQuestions(params) {
    const res = await axiosInstanceV2.post('assessment-questions', params);
    return res.data;
  }

  async updateQuestionTypes(params) {
    const res = await axiosInstanceV2.post('question-types', params);
    return res.data;
  }

  async updateTestLevels(params: { assessment_id: any; test_levels: []; deleted: [] }) {
    const res = await axiosInstanceV2.post('test-levels', params);
    return res.data;
  }

  async updateSuggestion(params: any) {
    const res = await axiosInstanceV2.post('suggestions', params);
    return res.data;
  }

  // delete
  async deleteAssessment(id: string) {
    const res = await axiosInstanceV2.delete(`assessments/${id}`);
    return res.data;
  }

  async deleteQuestionType(id: string) {
    const res = await axiosInstanceV2.delete(`question-types/${id}`);
    return res.data;
  }
}

export const assessmentService = new AssessmentService();
