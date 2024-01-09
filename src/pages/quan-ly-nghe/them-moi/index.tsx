import { CreateCareerModule } from '@/modules/ManageCareers/pages/CreateCareer';
import { AssessmentType } from '@/shared/enums/enums';
import { NextPage } from 'next';

const CreateCareer: NextPage = () => {
  return (
    <>
      <CreateCareerModule />
    </>
  );
};

export default CreateCareer;
