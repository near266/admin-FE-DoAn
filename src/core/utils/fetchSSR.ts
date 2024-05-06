/* eslint-disable no-undef */
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { GetServerSidePropsContext } from 'next';

import { IServerResponse } from '@/interfaces';
import { Common } from '@/shared';

export const callAPI = async (
  ctx: GetServerSidePropsContext,
  url: string,
  config: RequestInit = {}
): Promise<IServerResponse> => {
  const headers: any = {
    Accept: 'application/json',
  };

  // Append authorization header when logined
  const accessToken = Common.getAccessTokenFromServerSide(ctx.req.headers.cookie);
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
    // headers['Token-Is-Present'] = 1;
  }

  // Initial request init
  const requestInit: RequestInit = {
    ...config,
    headers,
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, requestInit);
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
