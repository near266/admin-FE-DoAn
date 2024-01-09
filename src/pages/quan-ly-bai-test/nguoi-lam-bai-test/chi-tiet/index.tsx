import UserAssessmentDetailModule from '@/modules/ManageAssessments/pages/UserAssessmentDetail';
import { Common } from '@/shared/utils';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import { genAssessmentInfo, genChartData, genSuggestion, genUserInfo } from '../goi-y';

export default function UserAssessmentDetailPage({
  assessment,
  chartData,
  suggestion,
  userInfo,
}) {
  return (
    <>
      <UserAssessmentDetailModule
        userInfo={userInfo}
        assessment={assessment}
        chartData={chartData}
        suggestion={suggestion}
      />
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  try {
    const { id, slug } = ctx.query;

    const accessToken = Common.getAccessTokenFromServerSide(ctx.req.headers.cookie);
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL_V2}/assessments/result?user_id=${id}&slug=${slug}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const userInfo = genUserInfo(data.user);
    const assessment = genAssessmentInfo(data ?? []);
    const suggestion = genSuggestion(data.result ?? [], data.test_type);
    const chartData = genChartData(data.result?.data ?? [], data.test_type);

    return {
      props: {
        assessment,
        chartData,
        suggestion,
        userInfo,
      },
    };
  } catch (error) {
    console.log(error);
    return { notFound: true };
  }
}
