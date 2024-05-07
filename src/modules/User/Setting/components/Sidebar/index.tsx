import { FC } from 'react';
import { useRouter } from 'next/router';
import { Paper } from '@mui/material';
import cx from 'classnames';

import styles from './styles.module.scss';

const MENUS = [
  {
    icon: 'bi bi-person-lines-fill',
    title: 'Thông tin cá nhân',
    tab: 'userInfo',
  },
  {
    icon: 'bi bi-shield-lock',
    title: 'Thay đổi mật khẩu',
    tab: 'changePassword',
  },
];

interface IProps {
  tab: string;
  changeTab: (tab: string) => void;
}

const Sidebar: FC<IProps> = ({ tab, changeTab }) => {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <Paper className={styles.sidebar}>
      <div className={styles.sidebar__back} onClick={goBack}>
        <i className="bi bi-chevron-left" /> Quay lại
      </div>

      <div className={styles.menu}>
        {MENUS.map((menu, index) => (
          <div
            key={index}
            className={styles.menuItem}
            onClick={() => changeTab(menu.tab)}
          >
            <div className={styles.menuItem__icon}>
              <i className={menu.icon} />
            </div>
            <div
              className={cx(
                styles.menuItem__title,
                tab === menu.tab ? styles.menuItem__title_active : null
              )}
            >
              {menu.title}
            </div>
            <div className={styles.menuItem__showIcon}>
              <i className="bi bi-chevron-right"></i>
            </div>
          </div>
        ))}
      </div>
    </Paper>
  );
};

export default Sidebar;
