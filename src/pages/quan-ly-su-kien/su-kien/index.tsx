import { GetServerSidePropsContext, NextPage } from 'next';

const Event: NextPage = (props) => {
  return <div>Event</div>;
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return {
    props: {},
  };
}
export default Event;
