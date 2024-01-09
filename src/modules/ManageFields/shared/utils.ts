export type FieldsResponse = {
  current_page: number;
  data: [
    {
      id: number;
      name: string;
      avatar: string;
      active: boolean;
      created_at: string;
      updated_at: string;
    }
  ];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: [
    {
      url: string;
      label: string;
      active: false;
    }
  ];
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
};
export type FieldResponse = {
  id: number;
  name: string;
  avatar: string;
  created_at: string;
  updated_at: string;
};
export type PayloadCreateField = {
  name: string;
  avatar: any;
};
