import { GetServerSideProps } from 'next';

import HtmlHeader from '@/layouts/Header/components/HtmlHeader';
import Show from '@/modules/User/pages/Show';
import { fetchSSR } from '@/core';

const Page = ({ personal }) => {
  const htmlTitle = `Trang cá nhân - ${personal.name}`;
  return (
    <>
      <HtmlHeader title={htmlTitle}>
        <meta name="description" content={personal.information} />
        <meta property="og:title" content={htmlTitle} />
        <meta property="og:description" content={personal.information} />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_URL}/profile/${personal.username}`}
        />
        <meta property="og:site_name" content="Eztek" />
        <meta property="og:image" content={personal.avatar} />
        <meta property="og:locale" content="vi_VN" />
      </HtmlHeader>
      <Show personal={personal} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const paramsString = new URLSearchParams({
    fields: 'id,name,address,information,avatar,username,identity_verified',
  }).toString();

  const res = await fetchSSR.callAPI(ctx, `users/${ctx.params.username}?${paramsString}`);

  if (res?.code !== 'SUCCESS') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      personal: res.payload,
    },
  };
};

export default Page;
