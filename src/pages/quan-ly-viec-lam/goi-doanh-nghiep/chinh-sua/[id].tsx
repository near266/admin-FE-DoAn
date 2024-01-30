import ICareer from '@/interfaces/models/ICareer';
import { careerService } from '@/modules/ManageCareers/shared/api';
import BussinessPackage from '@/modules/ManagerService/pages/BussinessPackage';
import { IGetListLicenseRes } from '@/modules/ManagerService/shared/interface';
import { callApiFromSV } from '@/shared/axios';
import { Common } from '@/shared/utils';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';

export interface IProps {
  license: IGetListLicenseRes;
}

const EditLicense: NextPage = (props: IProps) => {
  return (
    <>
      <BussinessPackage type={'edit'} />
    </>
  );
};

export default EditLicense;

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const { id } = ctx.params;
//   if (!id) return { notFound: true };
//   try {
//     const accessToken = Common.getAccessTokenFromServerSide(ctx.req.headers.cookie);
//     const {
//       data: { payload: license },
//     } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL_V4}/license/1`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     console.log(id);
//     if (!license) {
//       return {
//         notFound: true,
//       };
//     }
//     return {
//       props: {
//         license,
//       },
//     };
//   } catch (error) {
//     console.log(error);
//     return {
//       notFound: true,
//     };
//   }
// };
