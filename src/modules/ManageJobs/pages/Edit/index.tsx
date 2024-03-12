import {
  TAccount,
  TCompany,
  TNews,
} from '@/pages/quan-ly-thanh-vien/doanh-nghiep/chinh-sua/[id]';
import { Tabs } from 'antd';
import React, { useState } from 'react';
import { AccountInfoForm } from './Tabs/AccountInfo';
import { AvataJob } from '../../components/AvatarJob';
import { CompanyInfoForm } from './Tabs/CompanyInfo';
import { Resume } from './Tabs/Resume';
import { LicenseForm } from './Tabs/License';
import { News } from './Tabs/News';
import { useRouter } from 'next/router';
import { Classify } from './Tabs/Classify';
import Efficiency from './Tabs/Efficiency';
import { BussinessPackageChild } from './Tabs/BussinessPackage';
import { IGetListLicenseRes } from '@/modules/ManagerService/shared/interface';
import { NextPage } from 'next';
interface IProps {
  account: TAccount;
  company: TCompany;
  posts: TNews[];
  total_page: number;
  license?: IGetListLicenseRes[];
}
interface IAccountProps {
  account: TAccount;
}
interface ICompanyProps {
  company: TCompany;
}

interface IPostProps {
  posts: TNews[];
  total_page: number;
}

interface IPropBussiness {
  license: IGetListLicenseRes[];
}

const AccountInfoPage: React.FC<IAccountProps> = ({ account }: IProps) => (
  <AccountInfoForm accountInfo={account} />
);
const CompanyInfoPage: React.FC<ICompanyProps> = ({ company }: IProps) => (
  <CompanyInfoForm company={company} />
);
const LicenseInfoPage: React.FC = () => <LicenseForm />;
const NewsPage: React.FC<IPostProps> = ({ posts, total_page }: IProps) => (
  <News posts={posts} total_page={total_page} />
);
const CVPage: React.FC = () => <Resume />;
const BusinessPackagePage: React.FC = () => <BussinessPackageChild license={[]}/>;

// const BusinessPackagePage: NextPage = (props: IProps) => {
//   const { license } = props;
//   return (
//     <div>
//       <BussinessPackageChild license={license} />
//     </div>
//   );
// };


export function EditJobsModule({ account, company, posts, total_page, license }: IProps) {
  const tabs = [
    { key: 1, tab: <AccountInfoPage account={account} />, name: 'Thông tin tài khoản' },
    { key: 2, tab: <CompanyInfoPage company={company} />, name: 'Thông tin công ty' },
    { key: 3, tab: <LicenseInfoPage />, name: 'Giấy phép kinh doanh' },
    {
      key: 4,
      tab: <NewsPage posts={posts} total_page={total_page} />,
      name: 'Tin tuyển dụng',
    },
    { key: 5, tab: <CVPage />, name: 'CV' },
    { key: 6, tab: <Efficiency />, name: 'Hiệu suất' },
    { key: 7, tab: <Classify />, name: 'Phân loại' },
    { key: 8, tab: <BusinessPackagePage/>, name: 'Gói doanh nghiệp' },
  ];

  const [currentTabs, setCurrentTabs] = useState(tabs[0].key);
  const router = useRouter();

  return (
    <div className=" card bg-white px-8 py-6 editjob">
      <Tabs
        defaultActiveKey="1"
        onChange={(value) => {
          setCurrentTabs(parseInt(value));
        }}
      >
        {(currentTabs <= 3 || currentTabs === 7) && <AvataJob item={account} />}
        {tabs.map((item) => (
          <Tabs.TabPane tab={item.name} key={item.key}>
            {item.tab}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
}
