import { IUser } from '@/interfaces/models/IUser';
import CreateSugesstionModule from '@/modules/ManageAssessments/pages/CreateSugesstion';
import { AssessmentType } from '@/shared/enums/enums';
import { Common } from '@/shared/utils';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';

export default function SugesstionPage({ assessment, chartData, suggestion, userInfo }) {
  return (
    <>
      <CreateSugesstionModule
        userInfo={userInfo}
        assessment={assessment}
        chartData={chartData}
        suggestion={suggestion}
      />
    </>
  );
}
export const genUserInfo = (user: IUser) => {
  // chỉ trả về thông tin cần thiết vì sẽ được sử dụng trong component CreateSugesstion tránh lộ thông tin người dùng
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
  };
};
export const genAssessmentInfo = (props) => {
  const {
    name,
    question_count,
    slug,
    original_price,
    sale_price,
    test_time,
    test_type,
    id,
    short_desc,
  } = props || {};
  return {
    id: id ?? 0,
    name: name ?? '',
    questionCount: question_count ?? 0,
    slug: slug ?? '/',
    originPrice: original_price ?? 0,
    salePrice: sale_price ?? 0,
    duration: test_time ?? 0,
    short_desc: short_desc ?? '',
    assessmentType: test_type ?? '',
  };
};
export const genChartData = (
  data: any,
  chartType: AssessmentType
): { subject: string; point: number; maxPoint: number }[] | number => {
  if (chartType === AssessmentType.YOUR_SELF) {
    if (data?.length === 0) return [];
    return data
      ?.map((item) => {
        return {
          subject: item.name,
          point: item.point,
          maxPoint: item.max_point,
        };
      })
      .sort((a, b) => b.point - a.point);
  }
  if (chartType === AssessmentType.COMPETENCY) {
    if (data?.length === 0) return [];
    return data
      ?.map((item) => {
        return {
          subject: item.name,
          point: item.level,
          maxPoint: item.max_level,
        };
      })
      .sort((a, b) => b.point - a.point);
  }

  if (chartType === AssessmentType.CAREER) {
    if (data < 0) return 0;
    return data;
  }

  return [];
};

export const genSuggestion = (result: any, chartType: AssessmentType): any => {
  const finalSuggestion = {
    textContent: [],
    mentors: [],
    jobs: [],
    testLevel: 0,
    testLevelDesc: '',
    general: [],
    specific: [],
  };
  result.suggestion = result.suggestion ?? {};
  const {
    suggestion: { content },
  } = result;
  const prased = JSON.parse(content ?? '{"info":[],"suggestion":{}}');
  if (chartType === AssessmentType.YOUR_SELF) {
    const { data } = result;
    const {
      info,
      suggestion: { mentors, careers },
    } = prased;
    // lấy dữ liệu từ gợi ý trả về
    const fromSugesstion = info?.map((item) => {
      return {
        title: item.label,
        description: item.content,
        subData: item?.subdata ?? '',
      };
    });
    // lấy dữ liệu từ mô tả của chart
    const fromChart = data
      .map((item) => {
        return {
          title: item.name ?? '',
          description: item.description ?? '',
          subData: item.point ?? '',
        };
      })
      .sort((a, b) => b.subData - a.subData);

    finalSuggestion.textContent = [...fromSugesstion, ...fromChart];
    finalSuggestion.mentors = mentors ?? [];
    finalSuggestion.jobs = careers ?? [];
  }
  if (chartType === AssessmentType.COMPETENCY) {
    const { test_level, level_description } = result;
    const {
      info,
      suggestion: { mentors, careers },
    } = prased;

    const fromSugesstion =
      info &&
      info.map((item) => {
        return {
          title: item?.label,
          description: item?.content,
          subData: item?.subdata,
        };
      });
    finalSuggestion.textContent = fromSugesstion ?? [];
    finalSuggestion.mentors = mentors ?? [];
    finalSuggestion.jobs = careers ?? [];
    finalSuggestion.testLevel = test_level ?? 0;
    finalSuggestion.testLevelDesc = level_description ?? '';
  }

  if (chartType === AssessmentType.CAREER) {
    const {
      info,
      suggestion: { mentors, careers },
    } = prased;
    finalSuggestion.general = info.general?.data ?? [];
    finalSuggestion.specific = info.specific?.data ?? [];
    finalSuggestion.mentors = mentors ?? [];
    finalSuggestion.jobs = careers ?? [];
  }
  return finalSuggestion;
};
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
