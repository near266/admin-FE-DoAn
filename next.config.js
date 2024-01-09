/** @type {import('next').NextConfig} */
const withLess = require('next-with-less');
const path = require('path');
const pathToLessFileWithVariables = path.resolve(
  './src/assets/styles/layouts/antd-custom.less'
);
module.exports = withLess({
  lessLoaderOptions: {
    additionalData: (content) =>
      `${content}\n\n@import '${pathToLessFileWithVariables}';`,
  },
  reactStrictMode: false,
  swcMinify: true,
  poweredByHeader: false,
  distDir: 'dist',
  compiler: {
    styledComponents: true,
  },
  // optimizeFonts: false,
  images: {
    domains: [
      'storage.googleapis.com',
      'accounts.youth.com.vn',
      'images.unsplash.com',
      'adbox-staging.s3.ap-northeast-1.amazonaws.com',
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: { images: { layoutRaw: true } },
});
