import {
  DiplomaId,
  ExperienceId,
  FormOfWorkId,
  LevelId,
  ProbationaryPeriodId,
  SalaryTypeId,
} from '@/interfaces/models/IRecruitment';
import { GENDER_CODE } from '@/shared/enums/enums';
import { TOption } from '@/types';

const MASTER_DATA_GENDER: TOption[] = [
  { key: GENDER_CODE.male, name: 'male', label: 'Nam' },
  { key: GENDER_CODE.female, name: 'female', label: 'Nữ' },
  { key: GENDER_CODE.none, name: 'gay', label: 'Không yêu cầu' },
];
const MASTER_DATA_WORKING_METHOD: TOption[] = [
  { key: FormOfWorkId.FULLTIME, name: 'fulltime', label: 'Fulltime' },
  { key: FormOfWorkId.PARTTIME, name: 'parttime', label: 'Partime' },
  { key: FormOfWorkId.COLLABORATOR, name: 'ctv', label: 'Cộng tác viên' },
  { key: FormOfWorkId.ACTIVITIES, name: 'activity', label: 'Hoạt động ngoại khoá' },
];

const MASTER_DATA_DEGREE: TOption[] = [
  { key: DiplomaId.UNIVERSITY, name: 'university', label: 'Đại học' },
  { key: DiplomaId.COLLEGE, name: 'college', label: 'Cao đẳng' },
  { key: DiplomaId.HIGH_SCHOOL, name: 'highschool', label: 'Tốt nghiệp THPT' },
  { key: DiplomaId.NONE, name: 'no_degree', label: 'Không yêu cầu bằng cấp' },
];
const MASTER_DATA_SALARY_TYPE: TOption[] = [
  { key: SalaryTypeId.DEAL, name: 'deal', label: 'Thoả thuận' },
  { key: SalaryTypeId.ELECTIVE, name: 'elective', label: 'Tự chọn' },
];
const MASTER_DATA_PROBATION_PERIOD: TOption[] = [
  { key: ProbationaryPeriodId.ONE, name: 'fresher', label: '1 tháng' },
  { key: ProbationaryPeriodId.TWO, name: 'junior', label: '2 tháng' },
  { key: ProbationaryPeriodId.THREE, name: 'senior', label: '3 tháng' },
];
const MASTER_DATA_EXPERIENCE: TOption[] = [
  { key: ExperienceId.ONE, name: 'fresher', label: '1 năm' },
  { key: ExperienceId.TWO, name: 'junior', label: '2 năm' },
  { key: ExperienceId.THREE, name: 'senior', label: 'Trên 3 năm' },
  { key: ExperienceId.NONE, name: 'newbie', label: 'Không yêu cầu kinh nghiệm' },
];

const MASTER_DATA_CAREER_ID: TOption[] = [
  { key: ExperienceId.ONE, name: 'option1', label: 'option1' },
  { key: ExperienceId.TWO, name: 'option2', label: 'option2' },
  { key: ExperienceId.THREE, name: 'option3', label: 'option3' },
];

const MASTER_DATA_CAREER_FIELD_ID: TOption[] = [
  { key: ExperienceId.ONE, name: 'option1', label: 'option1' },
  { key: ExperienceId.TWO, name: 'option2', label: 'option2' },
  { key: ExperienceId.THREE, name: 'option3', label: 'option3' },
];

const MASTER_DATA_LEVEL: TOption[] = [
  { key: LevelId.INTERN, name: 'intern', label: 'Intern' },
  { key: LevelId.JUNIOR, name: 'junior', label: 'Junior' },
  { key: LevelId.SENIOR, name: 'senior', label: 'Senior' },
  { key: LevelId.MANAGER, name: 'manager', label: 'Manager' },
  { key: LevelId.HEAD, name: 'head', label: 'Head' },
];

const MASTER_DATA_GENDER_MAP = new Map([
  [GENDER_CODE.male, MASTER_DATA_GENDER[0]],
  [GENDER_CODE.female, MASTER_DATA_GENDER[1]],
  [GENDER_CODE.none, MASTER_DATA_GENDER[2]],
]);

const MASTER_DATA_WORKING_METHOD_MAP = new Map([
  [FormOfWorkId.FULLTIME, MASTER_DATA_WORKING_METHOD[0]],
  [FormOfWorkId.PARTTIME, MASTER_DATA_WORKING_METHOD[1]],
  [FormOfWorkId.COLLABORATOR, MASTER_DATA_WORKING_METHOD[2]],
  [FormOfWorkId.ACTIVITIES, MASTER_DATA_WORKING_METHOD[3]],
]);
const MASTER_DATA_DEGREE_MAP = new Map([
  [DiplomaId.UNIVERSITY, MASTER_DATA_DEGREE[0]],
  [DiplomaId.COLLEGE, MASTER_DATA_DEGREE[1]],
  [DiplomaId.HIGH_SCHOOL, MASTER_DATA_DEGREE[2]],
  [DiplomaId.NONE, MASTER_DATA_DEGREE[3]],
]);
const MASTER_DATA_SALARY_TYPE_MAP = new Map([
  [SalaryTypeId.DEAL, MASTER_DATA_SALARY_TYPE[0]],
  [SalaryTypeId.ELECTIVE, MASTER_DATA_SALARY_TYPE[1]],
]);

const MASTER_DATA_PROBATION_PERIOD_MAP = new Map([
  [ProbationaryPeriodId.ONE, MASTER_DATA_PROBATION_PERIOD[0]],
  [ProbationaryPeriodId.TWO, MASTER_DATA_PROBATION_PERIOD[1]],
  [ProbationaryPeriodId.THREE, MASTER_DATA_PROBATION_PERIOD[2]],
]);

const MASTER_DATA_LEVEL_MAP = new Map([
  [LevelId.INTERN, MASTER_DATA_LEVEL[0]],
  [LevelId.JUNIOR, MASTER_DATA_LEVEL[1]],
  [LevelId.SENIOR, MASTER_DATA_LEVEL[2]],
  [LevelId.MANAGER, MASTER_DATA_LEVEL[3]],
  [LevelId.HEAD, MASTER_DATA_LEVEL[4]],
]);

const MASTER_DATA_EXPERIENCE_MAP = new Map([
  [ExperienceId.ONE, MASTER_DATA_EXPERIENCE[0]],
  [ExperienceId.TWO, MASTER_DATA_EXPERIENCE[1]],
  [ExperienceId.THREE, MASTER_DATA_EXPERIENCE[2]],
  [ExperienceId.NONE, MASTER_DATA_EXPERIENCE[3]],
]);

// export all the constance in this file
export {
  MASTER_DATA_GENDER,
  MASTER_DATA_WORKING_METHOD,
  MASTER_DATA_DEGREE,
  MASTER_DATA_SALARY_TYPE,
  MASTER_DATA_PROBATION_PERIOD,
  MASTER_DATA_EXPERIENCE,
  MASTER_DATA_LEVEL,
  MASTER_DATA_GENDER_MAP,
  MASTER_DATA_CAREER_ID,
  MASTER_DATA_CAREER_FIELD_ID,
  MASTER_DATA_WORKING_METHOD_MAP,
  MASTER_DATA_DEGREE_MAP,
  MASTER_DATA_SALARY_TYPE_MAP,
  MASTER_DATA_PROBATION_PERIOD_MAP,
  MASTER_DATA_LEVEL_MAP,
  MASTER_DATA_EXPERIENCE_MAP,
};
