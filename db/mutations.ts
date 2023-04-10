import { Account, AccountRow, Month, User } from '@models/index';

export const mutations = {
  createAccount: async (_, { name, ownerId }) => {
    const u = User.findById(ownerId);
    if (!u) {
      return null;
    }
    const a = await Account.create({ name: name, owners: [ownerId] });
    return a;
  },
  createAccountRow: async (_, args) => {
    const monthArgs = {year: args.year, month: args.month};
    const month = await Month.findOneAndUpdate(monthArgs, monthArgs, {upsert:true}).exec();
    const ar = await AccountRow.create({
      account: args.accountId,
      date: args.date,
      text: args.text,
      desc: args.text,
      amount: args.amount,
      month: month._id
    });
    return ar;
  },
  deleteAccountRow: async (_, { id }) => {
    const deletedRow = await AccountRow.findByIdAndDelete(id).exec();
    return deletedRow ? deletedRow.id : null;
  }
};
