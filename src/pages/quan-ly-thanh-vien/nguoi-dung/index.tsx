import { GetServerSidePropsContext, NextPage } from 'next';

const MemberUser: NextPage = (props) => {
  return <div>MemberUser</div>;
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return {
    props: {},
  };
}
export default MemberUser;
