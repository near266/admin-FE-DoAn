import SrcIcons from '@/assets/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
export interface ISideBarProps {
  data?: 'TODO:Change me';
}

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  key: string,
  label: React.ReactNode,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key: key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const itemsIcon = {
  Mentors: SrcIcons.sideBarMentors,
  Mentor: SrcIcons.sideBarMentor,
  Courses: SrcIcons.sideBarCourses,
  Assessments: SrcIcons.sideBarAssessment,
  EventMng: SrcIcons.sideBarEventMng,
  Job: SrcIcons.sideBarJob,
  JobMng: SrcIcons.sideBarJobMng,
  MajorMng: SrcIcons.sideBarMajorMng,
  Coupon: SrcIcons.sideBarCoupon,
} as const;

const sideBarItems = [
  {
    label: 'Quản lý mentor',
    icon: itemsIcon.Mentors,
    pathName: '/quan-ly-mentors',
    children: [
      {
        label: 'Doanh nghiệp',
        pathName: '/quan-ly-mentors/doanh-nghiep',
      },
      {
        label: 'Người dùng',
        pathName: '/quan-ly-mentors/nguoi-dung',
      },
    ],
  },
  {
    label: 'Quản lý thành viên',
    icon: itemsIcon.Mentors,
    pathName: '/quan-ly-thanh-vien',
    children: [
      {
        label: 'Doanh nghiệp',
        pathName: '/quan-ly-thanh-vien/doanh-nghiep',
      },
      {
        label: 'Người dùng',
        pathName: '/quan-ly-thanh-vien/nguoi-dung',
      },
    ],
  },
  {
    label: 'Quản lý khóa học',
    icon: itemsIcon.Courses,
    pathName: '/quan-ly-khoa-hoc',
    children: [
      {
        label: 'Danh sách khoá học',
        pathName: '/quan-ly-khoa-hoc/danh-sach-khoa-hoc',
      },
      {
        label: 'Danh sách người mua',
        pathName: '/quan-ly-khoa-hoc/danh-sach-nguoi-mua',
      },
      {
        label: 'Danh mục',
        pathName: '/quan-ly-khoa-hoc/danh-muc',
      },
    ],
  },
  {
    label: 'Quản lý bài test',
    icon: itemsIcon.Assessments,
    pathName: '/quan-ly-bai-test',
    children: [
      {
        label: 'Bài test',
        pathName: '/quan-ly-bai-test/bai-test',
      },
      {
        label: 'Người làm bài test',
        pathName: '/quan-ly-bai-test/nguoi-lam-bai-test?type=1',
      },
    ],
  },
  {
    label: 'Quản lý sự kiện',
    icon: itemsIcon.EventMng,
    pathName: '/quan-ly-su-kien',
    children: [
      {
        label: 'Sự kiện',
        pathName: '/quan-ly-su-kien/su-kien',
      },
      {
        label: 'Giỏ hàng',
        pathName: '/quan-ly-su-kien/gio-hang',
      },
    ],
  },
  {
    label: 'Quản lý dịch vụ',
    icon: itemsIcon.Job,
    pathName: '/quan-ly-viec-lam',
    children: [
      // {
      //   label: 'Danh sách doanh nghiệp',
      //   pathName: '/quan-ly-viec-lam/danh-sach-doanh-nghiep',
      // },
      {
        label: 'Tin tuyển dụng',
        pathName: '/quan-ly-viec-lam/tin-tuyen-dung',
      },
      {
        label: 'Gói doanh nghiệp',
        pathName: '/quan-ly-viec-lam/goi-doanh-nghiep',
      },
    ],
  },
  {
    label: 'Quản lý CV',
    icon: itemsIcon.Mentors,
    pathName: '/quan-ly-cv',
    children: [
      {
        label: 'CV ứng tuyển',
        pathName: '/quan-ly-cv/cv-ung-tuyen',
      },
      {
        label: 'CV tìm kiếm việc làm',
        pathName: '/quan-ly-cv/cv-tim-kiem-viec-lam',
      },
    ],
  },
  {
    label: 'Quản lý nghề',
    icon: itemsIcon.JobMng,
    pathName: '/quan-ly-nghe',
  },
  {
    label: 'Quản lý lĩnh vực',
    icon: itemsIcon.MajorMng,
    pathName: '/quan-ly-linh-vuc',
  },
  {
    label: 'COUPON',
    icon: itemsIcon.Coupon,
    pathName: '/coupon',
  },
];

const navBarChangeList = [
  '/quan-ly-viec-lam/danh-sach',
  '/quan-ly-viec-lam/tin-tuyen-dung',
];
const generateMenuItem = () => {
  /* use link component for prefetch base on view port only */
  return sideBarItems.map((item) => {
    if (item.children) {
      return getItem(
        item.pathName,
        <Link href={item.pathName ?? '#'} legacyBehavior>
          <span>{item.label}</span>
        </Link>,
        <Image src={item.icon} height={20} width={20} />,
        item.children?.map((child) => {
          return getItem(child.pathName, <Link href="#">{child.label}</Link>);
        })
      );
    } else {
      return getItem(
        item.pathName,
        <Link href={item.pathName ?? '#'}>{item.label}</Link>,
        <Image src={item.icon} height={20} width={20} />
      );
    }
  });
};
const items = generateMenuItem();
export function SideBar(props: ISideBarProps) {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState(router.asPath);
  useEffect(() => {
    if (!navBarChangeList.includes(router.asPath)) return;
    setSelectedKey(router.asPath);
  }, [router.asPath]);
  const onClick: MenuProps['onClick'] = (e) => {
    setSelectedKey(e.key);
    router.push(e.key, undefined, { shallow: true });
  };
  return (
    <aside className="side-bar fixed left-0 h-full w-sidebar transition-transform duration-700 ease pr-2 bg-white p-[10px] hide_scrollbar overflow-y-auto min-h-screen shadow-[inset_-1px_0px_0px_#DCDCE0] z-[var(--side-bar-zindex)]">
      <Link href="/" legacyBehavior>
        <div className="relative w-full place-items-center cursor-pointer	flex items-center justify-center gap-2 h-[64px]">
          <Image src={SrcIcons.iconYouth} alt="Logo" width={36} height={36} priority />
          <h2 className="text-title font-title text-active m-0 uppercase text-[#22216D] text-xl w-[117px]">
            Youth+
          </h2>
        </div>
      </Link>

      <Menu
        className="sidebar"
        onClick={onClick}
        mode="inline"
        items={items}
        selectedKeys={[...[selectedKey]]}
      />
    </aside>
  );
}
