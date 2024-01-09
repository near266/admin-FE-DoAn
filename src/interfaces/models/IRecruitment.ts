export interface IRecruitment {
  id?: string;
  caching?: any;
  title: string;
  city_id: number;
  district_id: number;
  form_of_work_id: FormOfWorkId;
  diploma_id: DiplomaId;
  experience_id: ExperienceId;
  career_field_id: number;
  career_id: string;
  deadline: string;
  probationary_period_id: number;
  salary_type_id: number;
  salary_min: number;
  tags: { id: string; label: string }[];
  salary_max: number;
  overview: string;
  requirement: string;
  benefit: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  status_id: StatusId;
  image_url?: string;
  view_count?: number;
  approve_status_id?: ApproveStatusId;
  slug?: string;
  enterprise_id?: string;
  reason_of_rejection?: string;
  updated_at?: string;
}

export enum FormOfWorkId {
  FULLTIME = 1,
  PARTTIME = 2,
  COLLABORATOR = 3,
  ACTIVITIES = 4,
}

export enum StatusId {
  DRAFT = 0,
  ACTIVE = 1,
}

export enum DiplomaId {
  UNIVERSITY = 1,
  COLLEGE = 2,
  HIGH_SCHOOL = 3,
  NONE = 4,
}

export enum ExperienceId {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  NONE = 4,
}

export enum LevelId {
  INTERN = 1,
  JUNIOR = 2,
  SENIOR = 3,
  MANAGER = 4,
  HEAD = 5,
}
export enum ProbationaryPeriodId {
  ONE = 1,
  TWO = 2,
  THREE = 3,
}
export enum SalaryTypeId {
  DEAL = 1,
  ELECTIVE = 2,
}

export enum ScaleId {
  SCALE_1 = 1,
  SCALE_2 = 2,
  SCALE_3 = 3,
  SCALE_4 = 4,
  SCALE_5 = 5,
  STR_SCALE_1 = '0 - 25',
  STR_SCALE_2 = '25 - 50',
  STR_SCALE_3 = '50 - 100',
  STR_SCALE_4 = '100 - 200',
  STR_SCALE_5 = 'Trên 200',
}

export enum ApproveStatusId {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,

  TEXT_PENDING = 'PENDING',
  TEXT_APPROVED = 'APPROVED',
  TEXT_REJECTED = 'REJECTED',

  VN_PENDING = 'Đang chờ duyệt',
  VN_APPROVED = 'Đã được duyệt',
  VN_REJECTED = 'Bị từ chối',
}
