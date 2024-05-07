import { useEffect, useRef } from 'react';

export const useOnceCallWhenExistValue = (
  func: () => unknown,
  dependency: any,
  cleanAfter: number = 0
) => {
  const allowRunRef = useRef<boolean>(true);
  const timerRef = useRef<any>();

  useEffect(() => {
    if (allowRunRef.current && cleanAfter && !timerRef.current) {
      timerRef.current = setTimeout(() => {
        allowRunRef.current = false;
      }, cleanAfter);
    }

    if (dependency && allowRunRef.current) {
      func();
      allowRunRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependency]);
};
