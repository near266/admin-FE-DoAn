import SrcIcons from '@/assets/icons';
import { axiosInstanceV1 } from '@/shared/axios';
import { formatServerDateToDurationString } from '@/shared/helpers/date-helper';
import autoAnimate from '@formkit/auto-animate';
import { Card, Grid } from '@nextui-org/react';
import clsx from 'clsx';
import Image from 'next/legacy/image';
import { useEffect, useRef, useState } from 'react';
import CustomDropdown from '../CustomDropdown';

interface IProps {
  data?: 'TODO:Change me';
}

const mockupNotif = [
  {
    id: '961b6a2b2-522c-4598-9d25-5e40ce6c22be',
    data: {
      title:
        'Chào mừng bạn đến với cộng đồng <b>Youth+</b>, vui lòng cập nhật thông tin tài khoản <b>tại đây</b>',
      url: 'https://youth.com.vn/account/setting',
      image_url: 'https://accounts.youth.com.vn/images/avatar/default.jpeg',
    },
    read_at: null,
    created_at: '2022-06-15T01:55:17.000000Z',
  },
  {
    id: '961b62b2-5a2c-4598-9d25-5e40ce6c22be',
    data: {
      title:
        'Chào mừng bạn đến với cộng đồng <b>Youth+</b>, vui lòng cập nhật thông tin tài khoản <b>tại đây</b>',
      url: 'https://youth.com.vn/account/setting',
      image_url: 'https://accounts.youth.com.vn/images/avatar/default.jpeg',
    },
    read_at: '2022-06-15T01:55:17.000000Z',
    created_at: '2022-06-15T01:55:17.000000Z',
  },
  {
    id: '9a61b62b2-52aac-4598-9d25-5e40ce6c22be',
    data: {
      title:
        'Chào mừng bạn đến với cộng đồng <b>Youth+</b>, vui lòng cập nhật thông tin tài khoản <b>tại đây</b>',
      url: 'https://youth.com.vn/account/setting',
      image_url: 'https://accounts.youth.com.vn/images/avatar/default.jpeg',
    },
    read_at: '2022-06-15T01:55:17.000000Z',
    created_at: '2022-06-15T01:55:17.000000Z',
  },
  {
    id: '961b6a2b2-522c-4a598-9d25-5e40ce6c22be',
    data: {
      title:
        'Chào mừng bạn đến với cộng đồng <b>Youth+</b>, vui lòng cập nhật thông tin tài khoản <b>tại đây</b>',
      url: 'https://youth.com.vn/account/setting',
      image_url: 'https://accounts.youth.com.vn/images/avatar/default.jpeg',
    },
    read_at: null,
    created_at: '2022-06-15T01:55:17.000000Z',
  },
  {
    id: '961b62b2-522ac-as598-9d25-5e40ce6c22be',
    data: {
      title:
        'Chào mừng bạn đến với cộng đồng <b>Youth+</b>, vui lòng cập nhật thông tin tài khoản <b>tại đây</b>',
      url: 'https://youth.com.vn/account/setting',
      image_url: 'https://accounts.youth.com.vn/images/avatar/default.jpeg',
    },
    read_at: '2022-06-15T01:55:17.000000Z',
    created_at: '2022-06-15T01:55:17.000000Z',
  },
];

const Notification: React.FC = (props: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState('all');
  const [notifications, setNotifications] = useState(mockupNotif);
  const animateRef = useRef<HTMLDivElement>();
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (selected === 'un-read') {
      setNotifications(
        mockupNotif.filter((notification) => notification.read_at === null)
      );
    } else {
      setNotifications(mockupNotif);
    }
  }, [selected]);
  useEffect(() => {
    if (isOpen && animateRef.current) {
      autoAnimate(animateRef.current);
    }
  }, [isOpen]);

  const onShowMore = async () => {
    const data = axiosInstanceV1.get(`notifications?page=${page + 1}`);
  };
  const onNoficationClick = (e) => {
    setIsOpen(!isOpen);
    setAnchorEl(anchorEl ? null : e.target);
  };

  return (
    <Grid alignItems="center">
      <CustomDropdown
        dropdownMenu={
          <div
            className={clsx(
              'w-[400px] rounded-[6px] h-[400px] custom_scrollbar p-2 bg-white overflow-x-hidden overscroll-y-auto shadow-[1px_2px_5px_rgba(0,0,0,0.2)] transition-all duration-400 relative left-5 top-4',
              'duration-1000 transition-all ease '
            )}
          >
            <div className="flex justify-between items-center transition-all duration-700 ease from-transparent">
              <h2 className="text-primary text-[18px] font-title leading-[39px]">
                Thông báo
              </h2>
              <div className="flex flex-row gap-2 relative ">
                <span
                  className={`font-title leading-[24px] text-[12px] cursor-pointer${
                    selected === 'all' ? ' text-[#403ecc]' : ' text-[#696974]'
                  }`}
                  onClick={() => {
                    setSelected('all');
                  }}
                >
                  Tất cả
                </span>
                <span
                  className={`font-title leading-[24px] text-[12px] cursor-pointer ${
                    selected === 'un-read' ? 'text-[#403ecc]' : 'text-[#696974]'
                  }`}
                  onClick={() => {
                    setSelected('un-read');
                  }}
                >
                  Chưa đọc
                </span>
                <div
                  className={`h-[2px] bg-primary block absolute -bottom-[2px] rounded-t-[100px] ${
                    selected === 'all' ? 'w-[20%] left-[10%]' : 'w-[40%] left-[53%]'
                  }
                    transition-all ease duration-500
                  `}
                ></div>
              </div>
            </div>
            <Card
              variant="flat"
              className={`${true ? 'bg-[#D6D6FD] ' : 'bg-[#F6F6FF] '} rounded-[10px]`}
            >
              <Card.Body className="bg-white p-0 overflow-hidden">
                <div
                  ref={animateRef}
                  className="flex h-full flex-col gap-3 overflow-hidden hide_scrollbar"
                >
                  {notifications.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center justify-start min-h-[60px] gap-2 rounded-[10px] ${
                          item.read_at ? 'bg-[#D6D6FD] ' : 'bg-[#F6F6FF] '
                        } p-2 cursor-pointer`}
                      >
                        <div className="relative flex min-h-[26px] min-w-[26px] justify-center items-center h-6 w-6 rounded-full bg-transparent overflow-hidden">
                          <Image
                            objectFit="cover"
                            src={item.data.image_url}
                            layout="fill"
                            alt=""
                          />
                        </div>
                        <div>
                          <div
                            className="text-primary text-[12px] font-[400] leading-[18px] cursor-pointer tracking-[0.1px]"
                            dangerouslySetInnerHTML={{
                              __html: item.data.title,
                            }}
                          ></div>
                          <span
                            className={`${
                              item.read_at ? 'text-[#4c4b4c]' : 'text-[#92929D]'
                            }  text-[10px] font-[400] leading-[18px] cursor-pointer tracking-[0.1px]`}
                          >
                            {formatServerDateToDurationString(item.created_at)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
            {notifications.length > 4 && (
              <div
                className="mt-3 text-center w-full cursor-pointer"
                onClick={onShowMore}
              >
                Xem thêm
              </div>
            )}
          </div>
        }
      >
        <div className="flex items-center h-full z-50" onClick={onNoficationClick}>
          <Image src={SrcIcons.bell} height={20} width={20} />
        </div>
      </CustomDropdown>
    </Grid>
  );
};
export default Notification;
