import { request } from 'graphql-request';

export const fetcher = (query: string) => {
    if (process.env.NODE_ENV === 'development') console.log('GRAPHQL QUERY:', query)
    return request('/api/graphql', query)
      .then((res) => {
        if (res.errors) {
          res.errors.forEach((err) => console.log('SERVER ERROR', err.message));
        }
        if (process.env.NODE_ENV === 'development') console.log('GRAPHQL RESPONSE:', res)
        return res;
      })
      .catch((err) => {
        if (err) {
          err.response.errors.forEach((ierr) =>
            console.log('SERVER ERROR:', ierr.message)
          );
        }
      });
  };