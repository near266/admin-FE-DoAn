export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

export const isDevelopment = () => {
  return process.env.NODE_ENV !== 'development';
};

export const isServer = () => {
  return typeof window === 'undefined';
};

export const isBrowser = () => {
  return !isServer();
};
export const numberWithCommas = (number) => {
  return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
