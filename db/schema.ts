import { DateTypeDefinition, DateResolver } from 'graphql-scalars';
import { queries } from 'db/queries';
import { mutations } from 'db/mutations';
import { Account, User } from '@models/index';

export const typeDefs = `
type Query {
    info: String
    account(id: ID): Account
    accounts: [Account]
    user(id: ID): User
    users: [User]
}

type Mutation {
    createAccount(name: String!, ownerId: ID!): Account
}

${DateTypeDefinition}

type Account{
    id: String!
    name: String!
    owners: [User!]!
}

type AccountRow{
    date: Date!
    text: String!
    amount: Float!
    subrows: [SubRow!]!
    account: Account!
}

type SubRow{
    amount: Float!
    rowClass: RowClass
}

type Month{
    name: String!
    startDate: Date!
    nameMonth: Month
}

type RowClass{
    name: String!
    group: String!
}

type User{
    id: String!
    name: String!
}  
`;

export const resolvers = {
  Query: queries,
  Mutation: mutations,
};
