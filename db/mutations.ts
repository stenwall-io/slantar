import { Account, AccountRow, Month, User } from '@models/index';

export const mutations = {
  createAccount: async (_, { name, ownerId }) => {
    const u = User.findById(ownerId);
    if (!u) {
      return null;
    }
    const a = new Account({ name: name, owners: [ownerId] });
    await a.save();
    return a;
  },
  createAccountRow: async (_, { accountId, date, text, amount }) => {
    const ar = new AccountRow({
      account: accountId,
      date: date,
      text: text,
      desc: text,
      amount: amount,
    });
    await ar.save();
    return ar;
  },
  deleteAccountRow: async (_, { id }) => {
    const deletedRow = await AccountRow.findByIdAndDelete(id).exec();
    return deletedRow ? deletedRow.id : null;
  },
  createMonth: async (_, { year, month, startDate }) => {
    const d = new Month({
      year: year,
      month: month,
      startDate: startDate,
    });
    await d.save();
    return d;
  },
};
