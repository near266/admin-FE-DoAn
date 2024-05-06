import Head from 'next/head';
import { FC, ReactNode } from 'react';

interface IProps {
  title?: string;
  keepMetaData?: boolean;
  children?: ReactNode;
}

const defaultSiteTitle = 'EZTEK Admin';

/**
 * Usage note
 *
 * If `children` existed, should add `keepMetaData` to make the default meta is
 * present.
 */
const HtmlHeader: FC<IProps> = ({ title, children, keepMetaData }) => {
  const MetaData = (
    <>
      <meta name="description" content="EZTEK Admin" />
      <meta name="keywords" content="youth, EZTEK, youth plus, sinh viên, giới trẻ" />
      <meta property="og:title" content={title || defaultSiteTitle} />
      <meta property="og:url" content="https://youth.com.vn/" />
      <meta property="og:description" content="EZTEK Admin" />
      <meta property="og:type" content="website" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link
        href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      ></link>
    </>
  );

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="author" content="EZTEK" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
      />
      <link rel="icon" href="/icons/youth-plus-logo.svg" type="image/x-icon" />

      <title>{title || defaultSiteTitle}</title>

      {keepMetaData && MetaData}

      {/* {!isEmpty(children) && children}

      {isEmpty(children) && MetaData} */}
    </Head>
  );
};

export default HtmlHeader;
