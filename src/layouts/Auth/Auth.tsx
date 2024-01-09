import { Common } from '@/shared/utils';
import { IRootState } from '@/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
const Auth = ({ children }) => {
  const isAuthenticated = useSelector((state: IRootState) => state.auth.isAuthenticated);
  const isFetched = useSelector((state: IRootState) => state.auth.isFetched);
  const { role_codes } = useSelector((state: IRootState) => state.auth.me);
  const [isReady, setIsReady] = useState(false);
  const [accessable, setAccessable] = useState(false);
  useEffect(() => {
    if (!isAuthenticated) {
      return Common.redirectToAuthenticate();
    }
    if (role_codes?.includes('admin')) {
      setAccessable(true);
    }
    setIsReady(true);

    return () => {};
  }, [isAuthenticated, role_codes]);

  if (!isReady)
    return (
      <span className="text-center" aria-label="Loading ...">
        loading...
      </span>
    );

  return accessable ? (
    children
  ) : (
    <span className="text-center">Bạn không được phép truy cập!</span>
  );
};

export default Auth;
