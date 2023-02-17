import { DateTypeDefinition, DateResolver } from 'graphql-scalars';
import { queries } from 'db/queries';
import { mutations } from 'db/mutations';
import { Account, User } from '@models/index';

export const typeDefs = `
type Query {
    info: String
    account(id: ID): Account
    accounts: [Account]
    accountRows(accountId: ID): [AccountRow]
    user(id: ID): User
    users: [User]
    month(id: ID): Month
    months: [Month]
}

type Mutation {
    createAccount(name: String!, ownerId: ID!): Account!
    createAccountRow(accountId: ID!, date: Date!, text: String!, amount:Float!): AccountRow!
    deleteAccountRow(id: ID!): ID
    createMonth(year: Int! month: Int startDate: Date!): Month
}

${DateTypeDefinition}

type Account{
    id: String
    name: String!
    owners: [User!]!
}

type AccountRow{
    id: String
    account: Account!
    date: Date!
    text: String!
    desc: String!
    amount: Float!
    subrows: [SubRow!]!
}

type SubRow{
    id: String
    amount: Float!
    category: Category
}

type Month{
    id: String
    year: Int!
    month: Int!
    startDate: Date!
    name: String!
}

type Category{
    id: String
    name: String!
    group: String!
}

type User{
    id: String!
    name: String!
    username: String!
}  
`;

export const resolvers = {
  Query: queries,
  Mutation: mutations,
};
