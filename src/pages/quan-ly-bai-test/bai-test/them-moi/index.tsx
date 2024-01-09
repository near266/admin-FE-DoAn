import { CreateAssessmentModule } from '@/modules/ManageAssessments/pages/CreateAssessment';
import { AssessmentType } from '@/shared/enums/enums';
import { NextPage } from 'next';

const CreateAssessment: NextPage = () => {
  return (
    <>
      <CreateAssessmentModule />
    </>
  );
};

export default CreateAssessment;
