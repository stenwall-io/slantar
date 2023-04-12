import { Account, AccountRow, Month, User } from '@models/index';

export const queries = {
  info: () => `Slantar GraphQL API`,
  account: (_, { id }) => Account.findById(id),
  accounts: () => Account.find().sort('name'),
  accountRows: (_, { accountId }) =>
    AccountRow.find({ account: accountId })
      .populate({ path: 'subrows', strictPopulate: false })
      .sort('-date text'),
  user: (_, { id }) => User.findById(id),
  users: () => User.find(),
  month: (_, { id }) =>
    Month.findById(id).populate({path: 'accountrows', options: { sort: { date: -1 } } }),
  months: async () =>
    Month.find()
      .populate({path: 'accountrows', options: { sort: { date: -1 } } } )
      .sort('year month'),
};
