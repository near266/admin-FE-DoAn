import { AssessmentStatusCode } from '@/shared/enums/enums';
import IQuestion from './IQuestion';

export default interface IAssessment {
  file_name: any;
  id: number;
  name: string;
  content: string;
  description?: string;
  test_tutorial?: string;
  slug: string;
  avatar?: string;
  path?: string;
  columns?: any;
  type_code: number;
  sale_code?: number;
  status?: AssessmentStatusCode;
  test_time?: number;
  original_price?: number;
  sale_price?: number;
  assessment_type?: any;
  created_at?: string;
  updated_at?: string;
  category_id?: number;
  questions?: IQuestion[];
}
export default interface IUploadAssessment {
  id: number;
  job_post_id: number | string;
  user_id: number | string;
  email: string;
  cv_path?: string;
  status_id: string | number;
  phone: string;
  name: string;
  jobPost?: {
    id: number;
    title: string;
    slug: string;
    image_url: string;
  };
  jobEnterprise: {
    id: number;
    user_id: string | number;
    name: string;
    slug: string;
  };
  created_at?: string;
  updated_at?: string;
}
//
