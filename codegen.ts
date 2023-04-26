import type { CodegenConfig } from '@graphql-codegen/cli';
 
const config: CodegenConfig = {
  schema: 'http://localhost:3000/api/graphql',
  generates: {
    'types/gql.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
    },
  },
};
export default config;