import IUploadAssessment from '@/interfaces/models/IAssessment';
import { AssessmentDashboard } from '@/modules/ManageCV/pages/UploadDashboard';
import { Common } from '@/shared/utils';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';

export interface IAssessmentData {
  current_page: number;
  data: IUploadAssessment[];
}
export interface IProps {
  assessments: IAssessmentData;
}

const AssessmentMng: NextPage = (props: IProps) => {
  return (
    <div>
      <AssessmentDashboard assessments={props.assessments} />
    </div>
  );
};
export default AssessmentMng;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    // const accessToken = Common.getAccessTokenFromServerSide(ctx.req.headers.cookie);
    const {
      data: { data: assessments },
    } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL_V4}/candidate/searchAdminCandidate`,
      {
        rq: {
          page: 1,
          pageSize: 9999,
        },
      }
    );
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
