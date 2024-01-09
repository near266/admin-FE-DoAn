import { GetServerSidePropsContext, NextPage } from 'next';

const MemberEnterpise: NextPage = (props) => {
  return <div>MemberEnterpise</div>;
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return {
    props: {},
  };
}
export default MemberEnterpise;
