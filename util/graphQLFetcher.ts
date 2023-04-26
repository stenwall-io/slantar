import { request } from 'graphql-request';
import { Fetcher } from 'swr';

export const fetcher: Fetcher = (query: string) => {
  if (process.env.NODE_ENV === 'development')
    console.log('GRAPHQL QUERY:', query);

  return request('/api/graphql', query)
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
      if (err) {
        err.response.errors.forEach((ierr: Error) =>
          console.log('INTERNAL SERVER ERROR:', ierr.message)
        );
      }
    });
};

export default fetcher;
