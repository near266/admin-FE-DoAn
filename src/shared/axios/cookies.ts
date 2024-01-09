export function getByName(cookies: string, cname: string) {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(cookies);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    // eslint-disable-next-line eqeqeq
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    // eslint-disable-next-line lodash/prefer-startswith
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

export function get(cookieName: string) {
  return getByName(document.cookie, cookieName);
}

export function deleteAuthCookie() {
  const accessTokenName = process.env.NEXT_PUBLIC_ACCESS_TOKEN_NAME;
  // eslint-disable-next-line max-len
  document.cookie = `${accessTokenName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${process.env.NEXT_PUBLIC_DOMAIN}; path=/;`;
}
