import IAssessment from '@/interfaces/models/IAssessment';
import { IServerResponse } from '@/interfaces/server/IServerResponse';
import { EditAssessmentModule } from '@/modules/ManageAssessments/pages/EditAssessment';
import { assessmentService } from '@/modules/ManageAssessments/shared/api';
import { options, ResponseQuestionTypes } from '@/modules/ManageAssessments/shared/utils';
import { callApiFromSV } from '@/shared/axios';
import { AssessmentTypeNumeric } from '@/shared/enums/enums';
import { Common } from '@/shared/utils';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';

export interface IProps {
  assessment: IAssessment;
}

const EditAssessmentPage: NextPage = (props: IProps) => {
  const { assessment } = props;
  return (
    <>
      <EditAssessmentModule assessment={assessment} />
    </>
  );
};

export default EditAssessmentPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { slug } = ctx.query;
  if (!slug) return { notFound: true };
  try {
    const accessToken = Common.getAccessTokenFromServerSide(ctx.req.headers.cookie);
    const {
      data: { payload: assessment },
    } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL_V2}/assessments/${slug}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(assessment);
    return {
      props: {
        assessment,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
};
