/* eslint-disable no-undef */
import { IServerResponse } from '@/interfaces/server/IServerResponse';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { GetServerSidePropsContext } from 'next';
import { Common } from '../utils';

export const fetchSSR = async (
  ctx: GetServerSidePropsContext,
  url: string,
  config: RequestInit = {},
  apiVer?: string
): Promise<IServerResponse> => {
  const headers: any = {
    Accept: 'application/json',
  };

  // Append authorization header when logined
  const accessToken = Common.getAccessTokenFromServerSide(ctx.req.headers.cookie);
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  // Initial request init
  const requestInit: RequestInit = {
    ...config,
    headers,
  };

  const res = await fetch(
    `${apiVer ?? process.env.NEXT_PUBLIC_API_URL}/${url}`,
    requestInit
  );
  return res.json();
};

export const callGraphQL = (ctx: any) => {
  let accessToken = '';
  if (ctx.req) {
    accessToken = Common.getAccessTokenFromServerSide(ctx.req.headers.cookie);
  }

  const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    cache: new InMemoryCache(),
    ssrMode: true,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return client;
};
