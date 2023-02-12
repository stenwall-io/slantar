import { Schema, Model, model, models, Types, PopulatedDoc } from 'mongoose';
import { IRowClass } from '@models/index';

export interface IAccountRow {
  _id: Types.ObjectId;
  date: Date;
  text: string;
  amount: number;
  subrows: Array<ISubRow>;
}

interface ISubRow {
  rowClass: PopulatedDoc<IRowClass['_id'] & IRowClass>;
  amount: number;
}

const AccountRowSchema = new Schema<IAccountRow>({
  date: {
    type: Date,
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    trim: true,
  },
});

export default (models.AccountRow as Model<IAccountRow>) ||
  model<IAccountRow>('AccountRow', AccountRowSchema);
