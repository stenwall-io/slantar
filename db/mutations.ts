import { Account, AccountRow, Month, SubRow, User } from '@models/index';
import { MutationCreateAccountArgs, MutationCreateAccountRowArgs, MutationCreateSubRowArgs, MutationDeleteAccountRowArgs, MutationSetAccountRowMonthArgs, MutationUpdateAccountRowArgs, MutationUpdateSubRowArgs } from 'types/gql';

export const mutations = {
  createAccount: async (_:unknown, { name, ownerId}: MutationCreateAccountArgs) => {
    const u = User.findById(ownerId);
    if (!u) {
      return null;
    }
    const a = await Account.create({ name: name, owners: [ownerId] });
    return a;
  },
  createAccountRow: async (_:unknown, args:MutationCreateAccountRowArgs) => {
    const monthArgs = { year: args.year, month: args.month };
    const month = await Month.findOneAndUpdate(monthArgs, monthArgs, {
      upsert: true,
    }).exec();
    const ar = await AccountRow.create({
      account: args.accountId,
      date: args.date,
      text: args.text,
      desc: args.text,
      amount: args.amount,
      month: month._id,
    });
    // empty subrow is created on create
    return ar;
  },
  updateAccountRow: async (_:unknown, { accountRowId, monthId, desc, savings }:MutationUpdateAccountRowArgs) => {
    const accountRow = await AccountRow.findOneAndUpdate(
      { _id: accountRowId },
      { month: monthId, desc: desc, savings: savings }
    ).exec();
    return accountRow;
  },
  deleteAccountRow: async (_:unknown, { id }:MutationDeleteAccountRowArgs) => {
    const deletedRow = await AccountRow.findByIdAndDelete(id).exec();
    return deletedRow ? deletedRow.id : null;
  },
  setAccountRowMonth: async (_:unknown, { accountRowId, monthId }:MutationSetAccountRowMonthArgs) => {
    const accountRow = await AccountRow.findOneAndUpdate(
      { _id: accountRowId },
      { month: monthId }
    ).exec();
    return accountRow;
  },
  createSubRow: async (_:unknown, { accountRowId, amount }:MutationCreateSubRowArgs) => {
    const subRow = SubRow.create({ accountRow: accountRowId, amount: amount });
    return subRow;
  },
  updateSubRow: async (_:unknown, { subRowId, categoryId, extra, amount }:MutationUpdateSubRowArgs) => {
    const subRow = await SubRow.findOneAndUpdate(
      { _id: subRowId },
      {
        category: categoryId?categoryId:null,
        extra: extra,
        amount: amount,
      }
    ).exec();
    return subRow;
  },
};
