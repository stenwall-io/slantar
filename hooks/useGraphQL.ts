import request from 'graphql-request';
import useSWR, { Fetcher, SWRResponse } from 'swr';
import { Mutation, Query } from 'types/gql';

// TODO: test error handling
const fetcherFunc = async (query: string) => {
  if (process.env.NODE_ENV === 'development')
    console.log('GRAPHQL QUERY:', query);

  return await request('/api/graphql', query)
    .then((res) => {
      if (res.errors) {
        res.errors.forEach((err: Error) =>
          console.log('SERVER ERROR', err.message)
        );
      }
      if (process.env.NODE_ENV === 'development')
        console.log('GRAPHQL RESPONSE:', res);

      return res;
    })
    .catch((err) => {
      err.response.errors.forEach((ierr: Error) =>
        console.log('INTERNAL SERVER ERROR:', ierr.message)
      );

      return err;
    });
};

export function GraphQLQuery(query: string): SWRResponse<Query, Error> {
  const fetcher: Fetcher<Query, string> = fetcherFunc;
  return useSWR<Query, Error>(query, fetcher);
}

export function GraphQLMutation(query: string): SWRResponse<Mutation, Error> {
    const fetcher: Fetcher<Mutation, string> = fetcherFunc;
    return useSWR<Mutation, Error>(query, fetcher);
  }
