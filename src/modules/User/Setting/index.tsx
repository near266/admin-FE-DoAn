import { useState } from 'react';
import cx from 'classnames';

import { FullContentLayout } from '@/shared';
import { Sidebar } from './components';
import { UserInfo, ChangePassword } from './tabs';
import styles from './styles.module.scss';

const Setting = () => {
  const [tab, setTab] = useState<string>('userInfo');

  const changeTab = (data: string) => {
    setTab(data);
  };

  return (
    <FullContentLayout className={styles.page}>
      <div className="container">
        <div className="row">
          <div className={cx(styles.page__sidebar, 'col-lg-4')}>
            <Sidebar tab={tab} changeTab={changeTab} />
          </div>
          <div className="col-lg-8">
            {tab === 'userInfo' && <UserInfo />}

            {tab === 'changePassword' && <ChangePassword />}
          </div>
        </div>
      </div>
    </FullContentLayout>
  );
};

export default Setting;
