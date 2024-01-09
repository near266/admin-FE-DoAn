import { EditFieldModule } from '@/modules/ManageFields/pages/EditField';
import { fieldService } from '@/modules/ManageFields/shared/api';
import { FieldResponse } from '@/modules/ManageFields/shared/utils';
import { callApiFromSV } from '@/shared/axios';
import { Common } from '@/shared/utils';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { NextPage } from 'next';

interface IProps {
  field: FieldResponse;
}

const EditField: NextPage = (props: IProps) => {
  const { field } = props;
  return (
    <>
      <EditFieldModule field={field} />
    </>
  );
};
/* {
  "id": 1,
  "name": "Giao duc",
  "avatar": null,
  "created_at": null,
  "updated_at": null
} */
export default EditField;
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query;
  try {
    const accessToken = Common.getAccessTokenFromServerSide(ctx.req.headers.cookie);
    const { data: field } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL_V2}/career-fields/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return {
      props: {
        field,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
};
