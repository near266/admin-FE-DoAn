import { GetServerSideProps } from 'next';
import { Common } from '@/shared/utils';
import axios from 'axios';
import { NextPage } from 'next';
import { ResponseCoupon } from '@/modules/ManageCoupon/shared/utils';
import { CouponDashBoard } from '@/modules/ManageCoupon/pages/Dashboard';
import { ICoupon } from '@/interfaces/models/ICoupon';

interface IProps {
  coupon: ICoupon[];
  total?: string;
  links?: string[];
  current_page?: number;
}

const CouponMngPage: NextPage = (props: IProps) => {
  const { coupon, total, links, current_page } = props;
  return (
    <div>
      <CouponDashBoard
        coupon={coupon}
        total={total}
        links={links}
        current_page={current_page}
      />
    </div>
  );
};
export default CouponMngPage;

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const accessToken = Common.getAccessTokenFromServerSide(ctx.req.headers.cookie);

    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL_V2}/coupons?size=100`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const { total, links, current_page } = data;
    const coupon: ICoupon[] = data.data;

    return {
      props: {
        coupon,
        total,
        links,
        current_page,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
