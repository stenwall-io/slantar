import { DateTypeDefinition, DateResolver } from 'graphql-scalars';
import { queries } from 'db/queries';
import { mutations } from 'db/mutations';
import { gql } from 'graphql-request';

export const typeDefs = gql`
type Query {
    info: String
    account(id: ID): Account
    accounts: [Account]
    accountRows(accountId: ID): [AccountRow]
    user(id: ID): User
    users: [User]
    month(id: ID): Month
    months: [Month]
    categories: [Category]
}

type Mutation {
    createAccount(name: String!, ownerId: ID!): Account!
    createAccountRow(accountId: ID!, date: Date!, text: String!, amount:Float!, year: Int!, month: Int!): AccountRow!
    updateAccountRow(accountRowId: ID!, monthId: ID!, desc:String!, savings:Boolean!): AccountRow
    deleteAccountRow(id: ID!): ID
    setAccountRowMonth(accountRowId: ID!, monthId: ID!): AccountRow
    createSubRow(accountRowId: ID!, amount: Float!): SubRow
    updateSubRow(subRowId: ID!, categoryId: ID!, extra: Boolean!, amount: Float!): SubRow
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
    month: Month!
    date: Date!
    datef: String
    savings: Boolean!
    text: String!
    desc: String!
    amount: Float!
    amountf: String
    subrows: [SubRow]
}

type SubRow{
    id: String
    category: Category
    extra: Boolean!
    amount: Float!
    amountf: String!
}

type Month{
    id: String
    year: Int!
    month: Int!
    name: String!
    accountrows: [AccountRow]
}

type Category{
    id: String
    group: String!
    subgroup: String!
}

type User{
    id: String!
    name: String!
    username: String!
}  
`;

export const schema = typeDefs;

export const resolvers = {
  Query: queries,
  Mutation: mutations,
  Date: DateResolver
};
