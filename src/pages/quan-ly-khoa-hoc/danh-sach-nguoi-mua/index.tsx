import { GetServerSidePropsContext, NextPage } from 'next';

const PurchasedUser: NextPage = (props) => {
  return <div>PurchasedUser</div>;
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return {
    props: {},
  };
}
export default PurchasedUser;
