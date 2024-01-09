import { IRootState } from '@/store';
import { Loading } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const Redirect = () => {
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    const { id } = router.query;
    if (id !== '') {
      router.push(`/quan-ly-viec-lam/danh-sach-doanh-nghiep/chinh-sua/${id}`);
    }
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
