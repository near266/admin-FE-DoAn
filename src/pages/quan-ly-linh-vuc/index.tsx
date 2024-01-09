import { isEmpty } from 'lodash';
import { FieldDashboard } from '@/modules/ManageFields/pages/Dashboard';
import { FieldsResponse } from '@/modules/ManageFields/shared/utils';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import { IField } from '@/interfaces/models/IField';
import { fieldService } from '@/modules/ManageFields/shared/api';
import { callApiFromSV } from '@/shared/axios';
import { Common } from '@/shared/utils';

interface IProps {
  fields: IField[];
  current_page: number;
  total_field: number;
  links?: any[];
}
const MajorMngPage: NextPage = (props: IProps) => {
  const { fields, current_page, total_field, links } = props;
  const pagination = {
    current_page,
    total_field,
    links,
  };
  return (
    <div>
      <FieldDashboard fields={fields} pagination={pagination} />
    </div>
  );
};
export default MajorMngPage;

const mapToFields = (res: FieldsResponse) => {
  const { data } = res;
  if (isEmpty(data)) return [];
  return data.map((field) => {
    return {
      id: field.id,
      name: field.name,
      avatar: field.avatar,
      active: field.active,
    };
  });
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // vì ko dùng đc fetchSSR(lỗi ko biết tại sao) nên mới phải làm như này.
  try {
    const accessToken = Common.getAccessTokenFromServerSide(ctx.req.headers.cookie);
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL_V2}/career-fields?size=100`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { total, links, current_page } = data;
    const fields = mapToFields(data);
    return {
      props: { fields, current_page, total_field: total, links },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
};
