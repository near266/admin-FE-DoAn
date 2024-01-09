import { GetServerSidePropsContext, NextPage } from 'next';

const Courses: NextPage = (props) => {
  return <div>Courses</div>;
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return {
    props: {},
  };
}
export default Courses;
