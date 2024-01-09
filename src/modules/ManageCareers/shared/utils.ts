export type PayloadCreateCareer = {
  avatar?: any;
  name: string;
  description: string;
  field_id: number;
  main_tasks: string;
  required_competency: string;
  additional_competency: string;
  minimum_education: string;
  learning_path: string;
  area_of_expertise: string;
  workplace_example: string;
};

export type CareerResponse = {
  current_page: number;
  data: [
    {
      id: string;
      name: string;
      field_id: number;
      avatar: string;
      active: boolean;
      field: {
        id: number;
        name: string;
      };
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
      active: boolean;
    }
  ];
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: null;
  to: number;
  total: number;
};
