import { createYoga, createSchema } from 'graphql-yoga';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { typeDefs, resolvers } from 'db/schema';
import { Account, User } from '@models/index';
import 'db/index';

const schema = createSchema({
  typeDefs,
  resolvers,
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // only check privileges on api routes in production
  if (process.env.NODE_ENV !== 'development') {
    const token = await getToken({ req });
    if (token === null) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method Not Allowed`);
    }
  }

  const handler = createYoga({
    schema,
    // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
    graphqlEndpoint: '/api/graphql',
  });
  return handler(req, res);
};
