<<<<<<< HEAD
import IAssessment from '@/interfaces/models/IAssessment';
import { BusinessPackageDashboard } from '@/modules/ManagerService/pages/BusinessPackageDashboard';
import { IGetListLicenseRes } from '@/modules/ManagerService/shared/interface';
import { Common } from '@/shared/utils';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';

export interface IProps {
  license: IGetListLicenseRes[];
}

const BusinessPackage: NextPage = (props: IProps) => {
  const { license } = props;
  return (
    <div>
      <BusinessPackageDashboard license={license} />
    </div>
  );
};
export default BusinessPackage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const accessToken = Common.getAccessTokenFromServerSide(ctx.req.headers.cookie);
    const {
      data: { data: license },
    } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL_V4}/licenses?Page=1&PageSize=9999`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      {}
    );
    console.log(license);
    return {
      props: {
        license,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        license: [],
      },
    };
  }
};
=======
import { GetServerSidePropsContext, NextPage } from 'next';

const EnterprisePlanPage: NextPage = (props) => {
  return <div>EnterprisePlanPage</div>;
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return {
    props: {},
  };
}
export default EnterprisePlanPage;
>>>>>>> 6ebb136 (first commit)
