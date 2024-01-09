import IAssessment from '@/interfaces/models/IAssessment';
import { AssessmentDashboard } from '@/modules/ManageAssessments/pages/Dashboard';
import { Common } from '@/shared/utils';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';

export interface IProps {
  assessments: IAssessment[];
}

const AssessmentMng: NextPage = (props: IProps) => {
  const { assessments } = props;
  return (
    <div>
      <AssessmentDashboard assessments={assessments} />
    </div>
  );
};
export default AssessmentMng;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const accessToken = Common.getAccessTokenFromServerSide(ctx.req.headers.cookie);
    const {
      data: { data: assessments },
    } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL_V2}/assessments`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(assessments);
    return {
      props: {
        assessments,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        assessments: [],
      },
    };
  }
};
