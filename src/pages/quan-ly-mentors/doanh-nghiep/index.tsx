import { GetServerSidePropsContext, NextPage } from 'next';

const MentorsEnterpise: NextPage = (props) => {
  return <div>MentorsEnterpise</div>;
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return {
    props: {},
  };
}
export default MentorsEnterpise;
