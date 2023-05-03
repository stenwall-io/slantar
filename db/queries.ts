import { Account, AccountRow, Category, Month, User } from '@models/index';
import {
  QueryAccountArgs,
  QueryAccountRowsArgs,
  QueryMonthArgs,
  QueryUserArgs,
} from 'types/gql';

export const queries = {
  info: () => `Slantar GraphQL API`,
  account: (_: unknown, { id }: QueryAccountArgs) => Account.findById(id),
  accounts: () => Account.find().sort('name'),
  accountRows: (_: unknown, { accountId }: QueryAccountRowsArgs) =>
    AccountRow.find({ account: accountId })
      .populate({ path: 'subrows', strictPopulate: false })
      .sort('-date text'),
  user: (_: unknown, { id }: QueryUserArgs) => User.findById(id),
  users: () => User.find(),
  month: (_: unknown, { id }: QueryMonthArgs) =>
    Month.findById(id).populate({
      path: 'accountrows',
      populate: [{ path: 'subrows', populate: [{ path: 'category' }, { path: 'accountRow' }]}, { path: 'month'}],
      options: { sort: { date: -1 } },
    }),
  months: async () =>
    Month.find()
    .populate({
      path: 'accountrows',
      populate: [{ path: 'subrows', populate: [{ path: 'category' }, { path: 'accountRow' }]}, { path: 'month'}],
      options: { sort: { date: -1 } },
    })
      .sort('year month'),
  categories: () => Category.find(),
};
