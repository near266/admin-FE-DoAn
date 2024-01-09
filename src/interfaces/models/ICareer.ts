export default interface ICareer {
  id: number;
  name: string;
  image_url: string;
  slug: string;
  field: string;
  status: string;
  created_at: string;
  updated_at: string;
  updated_by: string;
  created_by: string;
  field_id: number;
  description: string;
  main_tasks: string;
  required_competency: string;
  additional_competency: string;
  minimum_education: string;
  learning_path: string;
  area_of_expertise: string;
  workplace_example: string;
}
