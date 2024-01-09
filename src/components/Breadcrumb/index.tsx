import { Breadcrumb } from 'antd';

export interface IBreadCrumbProps {
  data?: any;
}

export function BreadCrumb(props: IBreadCrumbProps) {
  return (
    <div>
      <Breadcrumb separator={<span className={''}>{'>>'}</span>} className={''}>
        <Breadcrumb.Item className={''} href="/">
          Trang chủ
        </Breadcrumb.Item>
        <Breadcrumb.Item className={''} href="">
          Bài test
        </Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
}
