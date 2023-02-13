import { Schema, Model, model, models, Types, PopulatedDoc } from 'mongoose';
import { IUser } from '@models/index';

export interface IAccount {
  _id: Types.ObjectId;
  id: string;
  name: string;
  owners: Types.Array<PopulatedDoc<IUser['_id'] & IUser>>;
}

const AccountSchema = new Schema<IAccount>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  owners: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

export default (models.Account as Model<IAccount>) ||
  model<IAccount>('Account', AccountSchema);
