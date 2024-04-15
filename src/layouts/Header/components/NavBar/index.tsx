import Notification from '@/components/Notification';
import UserPop from '@/components/UserNav';
import { AssessmentTypeNumeric } from '@/shared/enums/enums';
import { Grid } from '@nextui-org/react';
import { Tabs } from 'antd';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

export interface INavBarProps {
  data?: 'TODO:Change me';
}

const navItem = [
  {
    name: 'BÀI TEST',
    path: 'quan-ly-bai-test',

    tabs: [
      {
        name: 'Hiểu mình',
        queryString: `?type=${AssessmentTypeNumeric.YOUR_SELF}`,
        active: false,
      },
      {
        name: 'Hiểu nghề',
        queryString: `?type=${AssessmentTypeNumeric.CAREER}`,
        active: false,
      },
      {
        name: 'Năng lực',
        queryString: `?type=${AssessmentTypeNumeric.COMPETENCY}`,
        active: false,
      },
    ],
  },
  {
    name: 'Quản lý Mentor',
    path: 'quan-ly-mentors',
    tabs: [],
  },

  {
    name: 'Quản lý thành viên', path: 'quan-ly-thanh-vien', 
    tabs: [
    {
      name: 'Doanh nghiệp',
      queryString: '/quan-ly-thanh-vien/doanh-nghiep',
      active: false,
    },
    {
      name: 'Người dùng',
      queryString: '/quan-ly-thanh-vien/nguoi-dung',
      active: false,
    }],
  },

  {
    name: 'Quản lý khóa học',
    path: 'quan-ly-khoa-hoc',
    tabs: [],
  },

  { name: 'Quản lý sự kiện', path: 'quan-ly-su-kien', tabs: [] },

  {
    name: 'Quản lý việc làm',
    path: 'quan-ly-viec-lam',
    tabs: [
      {
        name: 'Tin tuyển dụng',
        queryString: '/quan-ly-viec-lam/tin-tuyen-dung',
        active: false,
      },
      {
        name: 'Gói doanh nghiệp',
        queryString: '/quan-ly-viec-lam/goi-doanh-nghiep',
        active: false,
      },
    ],
  },
  {
    name: 'Quản lý CV',
    path: 'quan-ly-cv',
    tabs: [
      {
        name: 'CV ứng tuyển',
        queryString: '/quan-ly-cv/cv-ung-tuyen',
        active: false,
      },
      {
        name: 'CV tìm kiếm việc làm',
        queryString: '/quan-ly-cv/cv-tim-kiem-viec-lam',
        active: false,
      },
      {
        name: 'CV bài test',
        queryString: '/quan-ly-cv/cv-bai-test',
      }
    ],
  },
  { name: 'Quản lý nghề', path: 'quan-ly-nghe', tabs: [] },
  { name: 'Quản lý lĩnh vực', path: 'quan-ly-linh-vuc', tabs: [] },
  { name: 'Quản lý Coupon', path: 'coupon', tabs: [] },
];

const { TabPane } = Tabs;
export function NavBar(props: INavBarProps) {
  const router = useRouter();
  const [tabs, setTabs] = useState({ defaultActiveKey: '', tabs: <></> });
  const addQueryString = useCallback(
    (queryString) => {
      const currentUrl = router.pathname;
      router.push(`${currentUrl}${queryString}`, undefined, {
        shallow: true,
      });
    },
    [router]
  );
  const [isOpen, setIsOpen] = useState(false);
  const onTabChange = (tabKey) => {
    if (tabKey[0] === '/') {
      router.push(tabKey);
    } else {
      addQueryString(tabKey);
    }
    setTabs((pre) => {
      return {
        ...pre,
        defaultActiveKey: tabKey,
      };
    });
  };
  useEffect(() => {
    const routerQuery = router.query;

    const currentTabs = navItem.find(
      (item) => item.path === router.pathname.split('/')[1]
    );
    if (currentTabs) {
      const { tabs } = currentTabs;
      const activeTab = tabs.find(
        (item) =>
          item.queryString ===
          `?${Object.keys(routerQuery)[0]}=${Object.values(routerQuery)[0]}`
      );
      setTabs({
        defaultActiveKey: activeTab ? activeTab.queryString : '1',
        tabs: (
          <>
            {tabs.map((item) => {
              return <TabPane tab={item.name} key={item.queryString} />;
            })}
          </>
        ),
      });
    }
  }, [router.pathname]);

  return (
    <nav className="fixed w-full bg-white h-navbar shadow-[inset_0px_-1px_0px_#E2E2EA] ml-[var(--width-sidebar)] px-3 z-[var(--nav-bar-zindex)] ">
      <Tabs size="large" activeKey={tabs.defaultActiveKey} onChange={onTabChange}>
        {tabs.tabs}
      </Tabs>
      <div className="fixed right-[1rem] top-0 h-[var(--height-navbar)]  flex items-center  z-[var(--nav-bar-zindex)]">
        <Grid.Container justify="flex-start" gap={1}>
          <Notification />
          <UserPop />
        </Grid.Container>
      </div>
    </nav>
  );
}
