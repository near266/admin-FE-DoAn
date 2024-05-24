import type { NextPage } from 'next';
import Assessment from './quan-ly-bai-test';
import EnterpriseDashboardPage from './quan-ly-thanh-vien/doanh-nghiep';
import Router from 'next/router';

const Home: NextPage = () => {
  return (
    <>
      <Assessment />
    </>
  );
};

export default Home;
