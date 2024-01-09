import { GetServerSidePropsContext, NextPage } from 'next';

const CartPage: NextPage = (props) => {
  return <div>CartPage</div>;
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return {
    props: {},
  };
}
export default CartPage;
