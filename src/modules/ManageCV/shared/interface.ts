export interface IGetListLicenseRes {
  account_id?: string;
  name?: string;
  nameTest?: string;
  field?: number;
  type?: number;
  gender?: number;
  typeSearch?: number;
  status?: number;
  points?: number;
  page?: number;
  pageSize?: number;
  id_assessment_user?: number;
  assessment_id?: number;
  cvPath?: string;
  assessment_Test_Results: {
    id?: number;
    result?: number;
    updated_at?: string;
  };
}
