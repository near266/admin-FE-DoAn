export enum AssessmentType {
  YOUR_SELF = 'ASSESSMENT_YOURSELF',
  CAREER = 'ASSESSMENT_CAREER',
  COMPETENCY = 'ASSESSMENT_COMPETENCY',
}

export enum AssessmentTypeVi {
  YOUR_SELF = 'Hiểu mình',
  CAREER = 'Hiểu nghề',
  COMPETENCY = 'Đánh giá năng lực',
}
export enum AssessmentTypeNumeric {
  YOUR_SELF = 1,
  CAREER = 2,
  COMPETENCY = 3,
}
export enum SuggestionStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCEL = 'CANCEL',
  RESOLVE = 'RESOLVE',
}
export const AssessmentTypeToAssessmentTypeNumeric = (type: AssessmentType) => {
  if (type === AssessmentType.YOUR_SELF) {
    return AssessmentTypeNumeric.YOUR_SELF;
  }
  if (type === AssessmentType.CAREER) {
    return AssessmentTypeNumeric.CAREER;
  }
  if (type === AssessmentType.COMPETENCY) {
    return AssessmentTypeNumeric.COMPETENCY;
  }
};

export enum AssessmentSaleCode {
  FREE = 1,
  PAID = 2,
  COMBO = 3,
}
export enum AssessmentStatusCode {
  DRAFT = 0,
  ACTIVE = 1,
}

export enum SV_RES_STATUS_CODE {
  success = 'SUCCESS',
  error = 'ERROR',
}
export enum GENDER_CODE {
  male = 1,
  female = 2,
  none = 3,
}
