export interface IGetListLicenseReq {
  license_code?: string;
  license_name?: string;
  career_field_id?: number;
  created_date?: string;
  status?: number;
  enterpriseId?:string;
}

export interface IGetListLicenseRes {
  discount?: number;
  total_amount?: number;
  career_field_id?: number;
  license_code?: string;
  license_name?: string;
  selling_price?: number;
  listed_price?: number;
  period?: number;
  quantity_record_view?: number;
  quantity_record_take?: number;
  images?: string[];
  description?: string;
  status?: number;
  title_video?: string;
  link_video?: string;
  id?: any;
  created_by?: string;
  expiration_date?: string;
  activation_date?: string;
  created_date?: string;
  last_modified_by?: string;
  last_modified_date?: string;
  enterpriseId?:string;
}
