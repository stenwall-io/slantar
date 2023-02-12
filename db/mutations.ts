import { Account, User } from "@models/index";

export const mutations = {
    createAccount: async (_, {name, ownerId}) => {
        const u = User.findById(ownerId)
        if (!u) {return null;}
        const a = new Account({name: name, owners: [ownerId]})
        await a.save()
        console.log(a.toObject())
        return a
    }
}