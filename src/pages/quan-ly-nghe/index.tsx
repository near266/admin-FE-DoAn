import ICareer from '@/interfaces/models/ICareer';
import { CareerDashboard } from '@/modules/ManageCareers/pages/Dashboard';
import { CareerResponse } from '@/modules/ManageCareers/shared/utils';
import { Common } from '@/shared/utils';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { GetServerSideProps, NextPage } from 'next';
interface IProps {
  careers: ICareer[];
}

const BusinessMngPage: NextPage = (props: IProps) => {
  const { careers } = props;
  return (
    <>
      <CareerDashboard careers={careers} />
    </>
  );
};
export default BusinessMngPage;

const mapToCareers = (res: CareerResponse) => {
  const { data } = res;
  if (isEmpty(data)) return [];
  return data.map((career) => {
    return {
      id: career.id ?? '',
      name: career.name ?? '',
      field: career.field?.name ?? '',
      field_id: career.id ?? '',
      avatar: career.avatar ?? '',
      status: career.active ?? 0,
    };
  });
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const accessToken = Common.getAccessTokenFromServerSide(ctx.req.headers.cookie);

    const {
      data: { payload },
    } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL_V2}/careers?size=100`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const { total, links, current_page } = payload;
    const careers = mapToCareers(payload);

    console.log(careers);
    return {
      props: { careers },
    };
  } catch (error) {
    console.log(error);
    return { notFound: true };
  }
};
