import {
  AssessmentTable,
  UserAssessmentDashboard,
} from '@/modules/ManageAssessments/pages/UserAssessments';
import { ROW_PERPAGE } from '@/modules/ManageAssessments/shared/constance';
import { ResponseUserAssessment } from '@/modules/ManageAssessments/shared/utils';
import { AssessmentTypeNumeric } from '@/shared/enums/enums';
import { Common } from '@/shared/utils';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';

interface IProps {
  userAssessment: AssessmentTable[];
  total?: number;
  links?: string[];
  current_page?: number;
}

const UserAssessmentMngPage: NextPage = (props: IProps) => {
  const { userAssessment, total, links, current_page } = props;
  return (
    <div>
      <UserAssessmentDashboard
        userAssessment={userAssessment}
        total={total}
        links={links}
        current_page={current_page}
      />
    </div>
  );
};
export default UserAssessmentMngPage;

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const mapToUserAssessment = (data: ResponseUserAssessment[]) => {
  return (
    data &&
    data.map((item) => {
      return {
        id: item.id,
        name: item.user.name,
        userId: item.user.id,
        test_name: item.assessment.name,
        avatar: item.user.avatar ?? '',
        slug: item.assessment.slug ?? '',
        email: item.user.email,
        time: item.submit_time,
        phone_number: item.user.telephone,
        status: item.suggestion_status,
        suggestion: item.order_status,
      };
    })
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const accessToken = Common.getAccessTokenFromServerSide(ctx.req.headers.cookie);
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL_V2}/assessments/submitted?type=${AssessmentTypeNumeric.YOUR_SELF}&size=${ROW_PERPAGE}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const { total, links, current_page } = data;
  const userAssessment = mapToUserAssessment(data.data);
  return {
    props: { userAssessment, total, links, current_page },
  };
};
