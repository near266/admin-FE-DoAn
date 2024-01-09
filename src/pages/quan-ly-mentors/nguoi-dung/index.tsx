import { GetServerSidePropsContext, NextPage } from 'next';

const MentorsUser: NextPage = (props) => {
  return <div>MentorsUser</div>;
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return {
    props: {},
  };
}
export default MentorsUser;
