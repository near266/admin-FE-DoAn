import SrcIcons from '@/assets/icons';
<<<<<<< HEAD
import { TAccount } from '@/pages/quan-ly-thanh-vien/doanh-nghiep/chinh-sua/[id]';
=======
import { TAccount } from '@/pages/quan-ly-viec-lam/danh-sach-doanh-nghiep/chinh-sua/[id]';
>>>>>>> 6ebb136 (first commit)
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
