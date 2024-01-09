import {
  AssessmentSaleCode,
  AssessmentStatusCode,
  AssessmentTypeNumeric,
} from '@/shared/enums/enums';
import { message } from 'antd';

export type options = {
  key: string | number;
  label: React.ReactNode;
  value: string | number;
};
export type ResponseUserAssessment = {
  id: number;
  assessment_id: number;
  user_id: string;
  suggestion_id: number;
  submit_time: string;
  order_status: string;
  suggestion_status: string;
  user: {
    id: string;
    name: string;
    email: string;
    telephone: string;
    avatar: string;
  };
  assessment: {
    id: any;
    name: string;
    slug: string;
  };
};
export type PayloadAssessment = {
  name: string;
  content: string;
  description: string;
  avatar: any;
  assessment_type: AssessmentTypeNumeric;
  test_tutorial: string;
  sale_code: AssessmentSaleCode;
  status?: AssessmentStatusCode;
  test_time: number;
  original_price: number;
  sale_price?: number;
};
export type ResponseAssessment = {
  id: number;
  name: string;
  content: string;
  description: string;
  test_tutorial: string;
  slug: string;
  avatar: string;
  columns: any;
  type_code: number;
  sale_code: number;
  status: number;
  created_at: string;
  updated_at: string;
  test_time: number;
  original_price: number;
  sale_price: number;
  assessment_type: number;
};

export type ResponseQuestionTypes = {
  id: string;
  name: string;
  description: string;
  max_point: number;
};

const errorMessage = {
  name: 'Tên không được để trống',
  content: 'Nội dung không được để trống',
  description: 'Mô tả không được để trống',
  avatar: 'Ảnh thumbnail không được để trống',
  assessment_type: 'Loại bài test không được để trống',
  test_tutorial: 'Hướng dẫn làm test không được để trống',
  sale_code: 'Mã khuyến mại không được để trống',
  test_time: 'Thời gian làm test không được để trống',
  original_price: 'Giá gốc không được để trống',
  sale_price: 'Giá bán không được để trống',
};
export const validateAssessmentPayload = (payload: PayloadAssessment) => {
  for (const key in payload) {
    if (Object.prototype.hasOwnProperty.call(payload, key)) {
      const element = payload[key];
      if (key === 'status') continue;
      if (key === 'original_price') continue;
      if (key === 'sale_price') continue;
      if (element === '' || element === null || element === undefined) {
        message.error(errorMessage[key]);
        return false;
      }
    }
  }
  return true;
};

const phan_loai = [
  {
    key: '0',
    label: 'Hiểu mình',
    value: AssessmentTypeNumeric.YOUR_SELF,
  },
  {
    key: '1',
    label: 'Hiểu nghề',
    value: AssessmentTypeNumeric.CAREER,
  },
  {
    key: '2',
    label: 'Năng lực',
    value: AssessmentTypeNumeric.COMPETENCY,
  },
];
const goi_test = [
  {
    key: '0',
    label: 'Miễn phí',
    value: AssessmentSaleCode.FREE,
  },
  {
    key: '1',
    label: 'Trả phí',
    value: AssessmentSaleCode.PAID,
  },
  {
    key: '2',
    label: 'Combo',
    value: AssessmentSaleCode.COMBO,
  },
];
const kieu_nguoi = [
  {
    key: '0',
    label: 'Kiểu người C (Conventional - Mẫu người công chức)',
    value: '0',
  },
  {
    key: '1',
    label: 'Kiểu người E (Enterprise - Thiên phú lãnh đạo)',
    value: '1',
  },
  {
    key: '2',
    label: 'Kiểu người R (Realistic - Người thực tế)',
    value: '2',
  },
];
const POINT = [
  {
    key: '0',
    label: '1',
    value: 1,
  },
  {
    key: '1',
    label: '2',
    value: 2,
  },
  {
    key: '2',
    label: '3',
    value: 3,
  },
  {
    key: '3',
    label: '4',
    value: 4,
  },
  {
    key: '4',
    label: '5',
    value: 5,
  },
];
const LEVEL = [
  {
    key: '0',
    label: 'Mức 1',
    value: 0,
  },
  {
    key: '1',
    label: 'Mức 2',
    value: 1,
  },
  {
    key: '2',
    label: 'Mức 3',
    value: 2,
  },
  {
    key: '3',
    label: 'Mức 4',
    value: 3,
  },
  {
    key: '4',
    label: 'Mức 5',
    value: 4,
  },
];

const CAREER_QESTION_TYPE = [
  {
    key: 0,
    label: 'Kiến thức nghề',
    value: 0,
  },
  {
    key: 1,
    label: 'Sở thích nghề',
    value: 1,
  },
  {
    key: 2,
    label: 'Năng lực nghề',
    value: 2,
  },
];
const COMPETENCY_QESTION_TYPE = [
  {
    key: 0,
    label: 'Lắng nghe',
    value: 0,
  },
  {
    key: 1,
    label: 'Giao tiếp',
    value: 1,
  },
];

export {
  phan_loai,
  goi_test,
  kieu_nguoi,
  POINT,
  LEVEL,
  CAREER_QESTION_TYPE,
  COMPETENCY_QESTION_TYPE,
};
