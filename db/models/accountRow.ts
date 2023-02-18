import { Schema, Model, model, models, Types, PopulatedDoc } from 'mongoose';
import { IAccount, ICategory, IMonth } from '@models/index';

export interface IAccountRow {
  _id?: Types.ObjectId;
  id?: string;
  account: PopulatedDoc<IAccount['_id'] & IAccount>;
  month: PopulatedDoc<IMonth['_id'] & IMonth>;
  date: Date;
  text: string;
  desc: string;
  amount: number;
  subrows: Array<ISubRow>;
}

interface ISubRow {
  category: PopulatedDoc<ICategory['_id'] & ICategory>;
  amount: number;
}

const AccountRowSchema = new Schema<IAccountRow>({
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
  },
  month: {
    type: Schema.Types.ObjectId,
    ref: 'Month',
  },
  date: {
    type: Date,
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
    default: ''
  },
  desc: {
    type: String,
    required: false,
    trim: true,
    default: ''
  },
  amount: {
    type: Number,
    required: true,
    trim: true,
    default: 0.0
  },
});

export default (models.AccountRow as Model<IAccountRow>) ||
  model<IAccountRow>('AccountRow', AccountRowSchema);
