import ICareer from '@/interfaces/models/ICareer';
import { EditCareerModule } from '@/modules/ManageCareers/pages/EditCareer';
import { careerService } from '@/modules/ManageCareers/shared/api';
import { callApiFromSV } from '@/shared/axios';
import { GetServerSideProps, NextPage } from 'next';

interface IProps {
  career: ICareer;
}

const EditCareer: NextPage = (props: IProps) => {
  const { career } = props;
  return (
    <>
      <EditCareerModule career={career} />
    </>
  );
};

export default EditCareer;
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query;
  try {
    const { payload: career } = await callApiFromSV.fetchSSR(
      ctx,
      `careers/${id}`,
      {},
      `${process.env.NEXT_PUBLIC_API_URL_V2}`
    );
    return {
      props: {
        career,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
};
