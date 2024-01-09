import { axiosInstanceV2 } from '@/shared/axios';
import { PayloadCoupon } from './utils';

class CouponServices {
  async createCoupon(coupon: PayloadCoupon) {
    const res = await axiosInstanceV2.post('coupons', coupon);
    return res.data;
  }
  async getCouponById(id: string) {
    const res = await axiosInstanceV2.get(`coupons/${id}`);
    return res.data;
  }
  async deleteCouponById(id: string) {
    const res = await axiosInstanceV2.delete(`coupons/${id}`);
    return res.data;
  }
}

export const counponServices = new CouponServices();
