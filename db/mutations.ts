import { Account, AccountRow, IAccountRow, User } from '@models/index';

export const mutations = {
  createAccount: async (_, { name, ownerId }) => {
    const u = User.findById(ownerId);
    if (!u) {
      return null;
    }
    const a = new Account({ name: name, owners: [ownerId] });
    await a.save();
    console.log(a.toObject());
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
    ar.save();
    return ar;
  },
};
