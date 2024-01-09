import '@/assets/styles/layouts/antd-custom.less';
import { useNProgress } from '@/hooks/useNProgress';
import { AppLayout } from '@/layouts/app';
import Auth from '@/layouts/Auth/Auth';
import { isBrowser } from '@/shared/helpers';
import { asyncProcessAuth } from '@/store';
import store from '@/store/configureStore';
import { NextUIProvider } from '@nextui-org/react';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import '../assets/styles/app.scss';
import '../assets/styles/layouts/antd-custom.less';

if (isBrowser()) {
  store.dispatch(asyncProcessAuth());
}
function MyApp({ Component, pageProps }: AppProps) {
  useNProgress();
  return (
    <Provider store={store}>
      <Auth>
        <NextUIProvider>
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </NextUIProvider>
      </Auth>
    </Provider>
  );
}

export default MyApp;
