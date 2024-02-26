import { ManageJobsDashBoard } from '@/modules/ManageJobs/pages/Dashboard';
import { JOBS_STATUS } from '@/modules/ManageJobs/shared/enum';
import { Common } from '@/shared/utils';
import axios from 'axios';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
interface IProps {
  jobs: TJobs[];
  total_page: number;
}

export type TJobs = {
  id: string | number;
  name: string;
  avatar: string;
  represent: string;
  email: string;
  plan: string;
  created_at: string;
  status: JOBS_STATUS;
};

// const EnterpriseDashboardPage: NextPage = ({ jobs, total_page }: IProps) => {
//   return <ManageJobsDashBoard jobs={jobs} total_page={total_page} />;
// };

// export default EnterpriseDashboardPage;

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   try {
//     const accessToken = Common.getAccessTokenFromServerSide(ctx.req.headers.cookie);
//     const {
//       data: { data: jobs, meta },
//     } = await axios.get(
//       `${process.env.NEXT_PUBLIC_ENTERPRISE_API_URL}/enterprises?page=1&size=7&sort=-created_at`,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     const { total_page } = meta;
//     return {
//       props: {
//         jobs,
//         total_page,
//       },
//     };
//   } catch (error) {
//     console.log(error);
//     return {
//       notFound: true,
//     };
//   }
// };

const EnterpriseDashboardPageTest: NextPage = ({ jobs, total_page }: IProps) => {
  return <ManageJobsDashBoard jobs={jobs} total_page={total_page} />;
};

export default EnterpriseDashboardPageTest;