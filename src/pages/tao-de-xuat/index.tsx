import { IRootState } from '@/store';
import { Loading } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const Redirect = () => {
  const { id } = useSelector((state: IRootState) => state.auth.me);
  const router = useRouter();
  useEffect(() => {
    const { slug, test_result_id } = router.query;
    if (slug !== '' && id !== '' && test_result_id !== '') {
      router.push(
        `/quan-ly-bai-test/nguoi-lam-bai-test/goi-y?id=${id}&slug=${slug}&test_result_id=${test_result_id}`
      );
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
