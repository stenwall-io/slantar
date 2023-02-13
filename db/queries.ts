import { Account, AccountRow, User } from '@models/index';

export const queries = {
  info: () => `Slantar GraphQL API`,
  account: (_, {id}) => Account.findById(id),
  accounts: () => Account.find(),
  accountRows: (_, {accountId}) => AccountRow.find({ account: accountId }),
  user: (_, {id}) => User.findById(id),
  users: () => User.find(),
};
