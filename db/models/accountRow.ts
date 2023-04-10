import { Schema, Model, model, models, Types, PopulatedDoc } from 'mongoose';
import { SubRow, ISubRow, IAccount, IMonth } from '@models/index';

export interface IAccountRow {
  _id?: Types.ObjectId;
  id?: string;
  account: PopulatedDoc<IAccount['_id'] & IAccount>;
  month: PopulatedDoc<IMonth['_id'] & IMonth>;
  date: Date;
  text: string;
  desc: string;
  amount: number;
  subrows: [Array<PopulatedDoc<ISubRow['_id'] & ISubRow>>]
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

AccountRowSchema.pre('save', async function() {
  if (this.isNew) {
    SubRow.create({accountRow: this.id, amount: this.amount})
  }
});

AccountRowSchema.post('find', function() {
  this.populate('subrows');
});

AccountRowSchema.virtual('subrows', {
  ref: 'SubRow',
  localField: '_id',
  foreignField: 'accountRow'
});

export default (models.AccountRow as Model<IAccountRow>) ||
  model<IAccountRow>('AccountRow', AccountRowSchema);
