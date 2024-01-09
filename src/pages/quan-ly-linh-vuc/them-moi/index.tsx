import { GetServerSideProps } from 'next';
import { CreateFieldModule } from '@/modules/ManageFields/pages/CreateField';
import { NextPage } from 'next';

const CreateField: NextPage = () => {
  return (
    <>
      <CreateFieldModule />
    </>
  );
};

export default CreateField;
