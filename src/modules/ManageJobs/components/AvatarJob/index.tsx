import SrcIcons from '@/assets/icons';
import { TAccount } from '@/pages/quan-ly-thanh-vien/doanh-nghiep/chinh-sua/[id]';
import { User } from '@nextui-org/react';
import React from 'react';

interface IProps {
  item: TAccount;
}

export function AvataJob({ item }: IProps) {
  return (
    <div className="bg-white py-6">
      <User
        className="!px-0"
        src={item?.avatar ?? SrcIcons.iconYouth}
        size="xl"
        name={`${item.first_name} ${item.last_name}`}
      >
        ({item.plan})
      </User>
    </div>
  );
}
