import { RecruitNews } from '@/modules/ManageJobs/pages/RecruitNews';
import { TNews } from '@/pages/quan-ly-thanh-vien/doanh-nghiep/chinh-sua/[id]';
import { Common } from '@/shared/utils';
import axios from 'axios';
import { GetServerSidePropsContext, NextPage } from 'next';
interface IProps {
  data: {
    data: TNews[];
    total: number;
  };
}

const RecruitNewsPage: NextPage = (props: IProps) => {
  const postPerPage = 5;
  const total_page = Math.ceil(props.data.total / postPerPage)
  return <RecruitNews posts={props.data.data} total_page={total_page} />;
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  try {
    const accessToken = Common.getAccessTokenFromServerSide(ctx.req.headers.cookie);

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_JOB_URL}/list-job?page=1&size=7&sort=-created_at`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { data } = response.data;

    return {
      props: {
        data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
}
export default RecruitNewsPage;
