// import Suggestions from '../../components/Suggestions';
import dynamic from 'next/dynamic';
import { UserAssessmentInfo } from '../../components/UserAssessmentInfo';

const Suggestions = dynamic(() => import('../../components/Suggestions'));
function UserAssessmentDetailModule({ assessment, chartData, suggestion, userInfo }) {
  console.log({ assessment, chartData, suggestion, userInfo });
  return (
    <>
      <UserAssessmentInfo assessmentInfo={assessment} userInfo={userInfo} />

      <Suggestions
        assessmentType={assessment.assessmentType}
        isFree
        shortDesc={assessment.short_desc}
        suggestion={suggestion}
      />
    </>
  );
}

export default UserAssessmentDetailModule;
