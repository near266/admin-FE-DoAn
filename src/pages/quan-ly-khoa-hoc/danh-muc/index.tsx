import { GetServerSidePropsContext, NextPage } from 'next';

const CoursesCategory: NextPage = (props) => {
  return <div>CoursesCategory</div>;
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return {
    props: {},
  };
}
export default CoursesCategory;
