import { GetServerSidePropsContext, NextPage } from 'next';

const EnterprisePlanPage: NextPage = (props) => {
  return <div>EnterprisePlanPage</div>;
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return {
    props: {},
  };
}
export default EnterprisePlanPage;
