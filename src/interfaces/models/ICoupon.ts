export interface ICoupon {
  id: string;
  code: string;
  discount: number;
  limit: number;
  used: number;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}
