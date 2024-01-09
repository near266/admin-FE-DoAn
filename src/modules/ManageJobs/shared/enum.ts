type AllValuesOf<T extends object> = T[keyof T];

export function convertOption(obj) {
  return Object.keys(obj).map((key) => {
    return { key: obj[key].key, value: obj[key].key, label: obj[key].label };
  });
}

export enum SORT_DIRECTION {
  DEFAULT = 'sort=-created_at',
  SORTED = 'sort=created_at',
}

export enum JOBS_STATUS {
  PENDING = 'Đang chờ duyệt',
  APPROVED = 'Đã duyệt',
  REJECTED = 'Từ chối',
}

export enum JOBS_STATUS_NUMERIC {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
}

export enum DENIED_POP_UP_NUMERIC {
  COMPANY = 0,
  NEWS = 1,
}

export enum DENIED_POP_UP {
  COMPANY = 'Lý do từ chối doanh nghiệp',
  NEWS = 'Lý do từ chối tin tuyển dụng',
}

export const GENDER = {
  MALE: {
    value: 0,
    label: 'Nam',
  },
  FEMALE: {
    value: 1,
    label: 'Nữ',
  },
  NO_REQUIRED: {
    value: 3,
    label: 'Không yêu cầu',
  },
} as const;

export type GENDER_LABEL = AllValuesOf<typeof GENDER>['label'];
export type GENDER_VALUE = AllValuesOf<typeof GENDER>['value'];

export const WORKING_METHOD = {
  FULLTIME: { key: 0, name: 'fulltime', label: 'Fulltime' },
  PARTTIME: { key: 1, name: 'parttime', label: 'Partime' },
  CTV: { key: 2, name: 'ctv', label: 'Cộng tác viên' },
  ACTIVITY: { key: 3, name: 'activity', label: 'Hoạt động ngoại khoá' },
};
export const FIELD = {
  EDUCATION: { key: 0, name: 'education', label: 'Giáo dục/Đào tạo' },
  COMUNIITCATION: { key: 1, name: 'comunitcation', label: 'Báo trí/Truyền hình' },
};
export const DEGREE = {
  UNIVERSITY: { key: 0, name: 'university', label: 'Đại học' },
  COLLEGE: { key: 1, name: 'college', label: 'Cao đẳng' },
  GENERAL_EDUCATION: { key: 2, name: 'general_education', label: 'Tốt nghiệp THPT' },
  NO_DEGREE: { key: 3, name: 'no_degree', label: 'Không yêu cầu bằng cấp' },
};
export const SALARY_TYPE = {
  CONSENT: { key: 0, name: 'consent', label: 'Thoả thuận' },
  OPTIONAL: { key: 1, name: 'optional', label: 'Tự chọn' },
};
export const PROBATION_PERIOD = {
  FRESHER: { key: 0, name: 'fresher', label: '1 năm' },
  JUNIOR: { key: 1, name: 'junior', label: '2 năm' },
  SENIOR: { key: 2, name: 'senior', label: 'Trên 3 năm' },
  NEWBIE: { key: 3, name: 'newbie', label: 'Không yêu cầu kinh nghiệm' },
};
export const EXPERIENCE = {
  INTERN: { key: 0, name: 'intern', label: 'Intern' },
  JUNIOR: { key: 1, name: 'junior', label: 'Junior' },
  SENIOR: { key: 2, name: 'senior', label: 'Senior' },
  MANAGER: { key: 3, name: 'manager', label: 'Manager' },
  HEAD: { key: 4, name: 'head', label: 'Head' },
};
export const LEVEL = {
  INTERN: { key: 0, name: 'intern', label: 'Intern' },
  JUNIOR: { key: 1, name: 'junior', label: 'Junior' },
  SENIOR: { key: 2, name: 'senior', label: 'Senior' },
  MANAGER: { key: 3, name: 'manager', label: 'Manager' },
  HEAD: { key: 4, name: 'head', label: 'Head' },
};
export const JOB = {
  EDUCATION: { key: 0, name: 'education', label: 'Lập trình viên' },
  COMUNITCATION: { key: 1, name: 'comunitcation', label: 'Vua mọi nghề' },
};
export enum RECRUITMENT_DATA_FIELD {
  title = 'title',
  city = 'city',
  district = 'district',
  map_url = 'map_url',
  avatar = 'avatar',
  form_of_work = 'form_of_work',
  diploma = 'diploma',
  experience = 'experience',
  level = 'level',
  gender = 'gender',
  career_field_id = 'career_field_id',
  career_id = 'career_id',
  deadline = 'deadline',
  probationary_period = 'probationary_period',
  salary_type = 'salary_type',
  salary_min = 'salary_min',
  salary_max = 'salary_max',
  tags = 'tags',
  overview = 'overview',
  requirement = 'requirement',
  benefit = 'benefit',
  contact_name = 'contact_name',
  contact_phone = 'contact_phone',
  contact_email = 'contact_email',
  status_id = 'status_id',
  caching = 'caching',
  image_url = 'image_url',
}

export const SCALE = {
  SCALE_1: { key: 1, name: '0 - 25', label: '0 - 25' },
  SCALE_2: { key: 3, name: '25 - 50', label: '25 - 50' },
  SCALE_3: { key: 2, name: '50 - 100', label: '50 - 100' },
  SCALE_4: { key: 4, name: '100 - 200', label: '100 - 200' },
  SCALE_5: { key: 5, name: 'Trên 200', label: 'Trên 200' },
};

export type WORKING_METHOD_LABEL = AllValuesOf<typeof WORKING_METHOD>['label'];
export type WORKING_METHOD_KEY = AllValuesOf<typeof WORKING_METHOD>['key'];

export type FIELD_LABEL = AllValuesOf<typeof FIELD>['label'];
export type FIELD_KEY = AllValuesOf<typeof FIELD>['key'];

export type SALARY_TYPE_LABEL = AllValuesOf<typeof SALARY_TYPE>['label'];
export type SALARY_TYPE_KEY = AllValuesOf<typeof SALARY_TYPE>['key'];

export type PROBATION_PERIOD_LABEL = AllValuesOf<typeof PROBATION_PERIOD>['label'];
export type PROBATION_PERIOD_KEY = AllValuesOf<typeof PROBATION_PERIOD>['key'];

export type EXPERIENCE_LABEL = AllValuesOf<typeof EXPERIENCE>['label'];
export type EXPERIENCE_KEY = AllValuesOf<typeof EXPERIENCE>['key'];

export type LEVEL_LABEL = AllValuesOf<typeof LEVEL>['label'];
export type LEVEL_KEY = AllValuesOf<typeof LEVEL>['key'];

export type DEGREE_LABEL = AllValuesOf<typeof DEGREE>['label'];
export type DEGREE_KEY = AllValuesOf<typeof DEGREE>['key'];

export type JOB_LABEL = AllValuesOf<typeof JOB>['label'];
export type JOB_KEY = AllValuesOf<typeof JOB>['key'];

export type SCALE_LABEL = AllValuesOf<typeof SCALE>['label'];
export type SCALE_KEY = AllValuesOf<typeof SCALE>['key'];
