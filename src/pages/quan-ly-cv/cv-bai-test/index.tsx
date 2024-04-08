import { ListCVTestDashboard } from "@/modules/ManageCV/pages/ListCVTest";
import { IGetListLicenseRes } from "@/modules/ManageCV/shared/interface";
import { Common } from '@/shared/utils';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';


export interface IProps {
  license: IGetListLicenseRes[];
}

const ListCVTest: NextPage = (props: IProps) => {
    const { license } = props;
    return (
        <>
          <ListCVTestDashboard license={[]}/>
        </>
    );
};
export default ListCVTest;

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