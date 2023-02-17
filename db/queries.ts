import { Account, AccountRow, Month, User } from '@models/index';

export const queries = {
  info: () => `Slantar GraphQL API`,
  account: (_, { id }) => Account.findById(id),
  accounts: () => Account.find().sort('name'),
  accountRows: (_, { accountId }) =>
    AccountRow.find({ account: accountId }).sort('-date text'),
  user: (_, { id }) => User.findById(id),
  users: () => User.find(),
};
