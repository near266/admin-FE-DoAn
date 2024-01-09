export default interface IQuestion {
  answers: { id: number; point: number; content: string }[];
  assessment_id: any;
  columns: any;
  content: string;
  created_at: string;
  id: any;
  question_type: string;
  updated_at: string;
}
