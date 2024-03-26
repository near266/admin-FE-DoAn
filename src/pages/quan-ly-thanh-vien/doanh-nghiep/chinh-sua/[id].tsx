import { EditJobsModule } from '@/modules/ManageJobs/pages/Edit';
import { JOBS_STATUS, JOBS_STATUS_NUMERIC } from '@/modules/ManageJobs/shared/enum';
import { Common } from '@/shared/utils';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';

interface IProps {
  account: TAccount;
  company: TCompany;
  posts: TNews[];
  post_total_page: number;
}

export type TAccount = {
  id: string | number;
  avatar: string;
  first_name: string;
  last_name: string;
  address: string;
  created_at: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
  enterprise_id: string;
  gender_id: number;
  phone: string;
  phone_verified: boolean;
  pricing_plan_id: string;
  plan: string;
};

export type TCompany = {
  id: string | number;
  name: string;
  scale_id: number;
  city_id: number;
  district_id: number;
  ward_id: number;
  address: string;
  phone: string;
  career_field_id: string;
  website_url: string;
  introduce: string;
  phone_verified: boolean;
};

export type TNews = {
  id: string | number;
  title: string;
  image_url: string;
  total_cv: number;
  created_at: string;
  approve_status_id: JOBS_STATUS_NUMERIC;
};

const EditJobPage: NextPage = ({ account, company, posts, post_total_page}: IProps) => {
  return (
    <EditJobsModule
      account={account}
      company={company}
      posts={posts}
      total_page={post_total_page} 
      license={[]}    />
  );
};

export default EditJobPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.params;

  try {
    const accessToken = Common.getAccessTokenFromServerSide(ctx.req.headers.cookie);

    const {
      data: { data: account },
    } = await axios.get(
      `${process.env.NEXT_PUBLIC_ENTERPRISE_API_URL}/enterprises/${id}/account`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const {
      data: { data: company },
    } = await axios.get(
      `${process.env.NEXT_PUBLIC_ENTERPRISE_API_URL}/enterprises/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const {
      data: { data: posts, meta },
    } = await axios.get(
      `${process.env.NEXT_PUBLIC_ENTERPRISE_API_URL}/enterprises/${id}/job-posts?page=1&size=7&sort=-created_at`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const { total_page } = meta;
    return {
      props: {
        account,
        company,
        posts,
        total_page,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
};
