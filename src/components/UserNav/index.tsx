import SrcIcons from '@/assets/icons';
import { asyncLogoutAuth, IRootState } from '@/store';
import { Grid, User } from '@nextui-org/react';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomDropdown from '../CustomDropdown';
import styles from './styles.module.scss';

export interface IProps {
  data?: '';
}

const UserPop: React.FC = (props: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const { avatar, id, name } = useSelector((state: IRootState) => state.auth.me);
  const { data } = useSelector((state: any) => state.login);
  const handleClick = (e) => {
    setIsOpen(!isOpen);
    setAnchorEl(anchorEl ? null : e.target);
  };
  const logout = () => {
    dispatch(asyncLogoutAuth());
  };
  return (
    <Grid>
      <CustomDropdown
        dropdownMenu={
          <div className={styles.menu}>
            <div className={styles.currentUser}>
              <div className={styles.currentUser__name}>{data.userName}</div>
              <div className="username">{`@${data.userName}`}</div>
            </div>
            <div className={styles.divider} />
            <ul className={styles.expandMenu}>
              <li>
                <Link href={'/profile}'} className={styles.expandMenu__item}>
                  <i className="fa-solid fa-user" />
                  Trang cá nhân
                </Link>
              </li>
              <li>
                <Link href="#" className={styles.expandMenu__item}>
                  <i className="fa fa-cog" />
                  Cài đặt tài khoản
                </Link>
              </li>
              <li>
                <Link href="#" className={styles.expandMenu__item}>
                  <i className="fas fa-book" />
                  Quản lý CV
                </Link>
              </li>

              <div className={styles.divider} />
              <li>
                {/* TODOKOGAP: Xem co che dang xuat khac hay hon k */}
                <span className={styles.expandMenu__item} onClick={logout}>
                  <i className="fa fa-sign-out-alt" />
                  Đăng xuất
                </span>
              </li>
            </ul>
          </div>
        }
      >
        <div className="flex items-center gap-3" onClick={handleClick}>
          <User
            as="button"
            size="md"
            color="primary"
            name={data.userName}
            description={`@${data.userName}`}
            src={avatar ?? SrcIcons.iconYouth}
          />
          <Image src={SrcIcons.dropDown} height={20} width={20} />
        </div>
      </CustomDropdown>
    </Grid>
  );
};
export default UserPop;
