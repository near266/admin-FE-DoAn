import { IRootState } from '@/store';
import { Loading } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const Redirect = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('quan-ly-viec-lam/tin-tuyen-dung?page=1');
  }, [router]);
  return (
    <>
      <div className="tw-flex">
        <Loading />
      </div>
    </>
  );
};

export default Redirect;
