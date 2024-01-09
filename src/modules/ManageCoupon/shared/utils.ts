export type ResponseCoupon = {
  id: string;
  code: string;
  discount: number;
  limit: number;
  used: number;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
};

export type PayloadCoupon = {
  code: string;
  discount: number;
  start_time: string;
  end_time: string;
  user_ids?: string[];
};
export const generateCouponCode = (length: number, dataset?: string): string => {
  const chars = dataset ?? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};
