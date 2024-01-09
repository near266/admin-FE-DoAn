import { IRecruitment } from '@/interfaces/models/IRecruitment';
import { Common } from '@/shared/utils';
import axios from 'axios';
import { GetServerSideProps } from 'next';

import dynamic from 'next/dynamic';

const ManageJobsNewsDetail = dynamic(
  () => import('@/modules/ManageJobs/components/NewsDetail'),
  { ssr: false }
);
type Props = {
  data: {
    data: IRecruitment;
  }
};

const EditRecruitment = (props: Props) => {
  console.log("🚀 ~ file: [id].tsx:17 ~ EditRecruitment ~ props:", props.data)
  return (
    <>
      <ManageJobsNewsDetail recruitment={props.data.data} />
    </>
  );
};

export default EditRecruitment;
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const accessToken = Common.getAccessTokenFromServerSide(ctx.req.headers.cookie);

    const url = process.env.NEXT_PUBLIC_API_JOB_URL;
    const { id } = ctx.query;
    // disable eslint
    const response = await axios.get(`${url}/details/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = response.data
    console.log(response.data);
    return {
      props: { data },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
