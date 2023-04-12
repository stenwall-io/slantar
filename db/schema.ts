import { DateTypeDefinition, DateResolver } from 'graphql-scalars';
import { queries } from 'db/queries';
import { mutations } from 'db/mutations';

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
    createAccountRow(accountId: ID!, date: Date!, text: String!, amount:Float!, year: Int!, month: Int!): AccountRow!
    deleteAccountRow(id: ID!): ID
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
    datef: String
    text: String!
    desc: String!
    amount: Float!
    amountf: String
    subrows: [SubRow]
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
    accountrows: [AccountRow]
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
  Date: DateResolver
};
