import { Schema, Model, model, models, Types, PopulatedDoc } from 'mongoose';
import { IAccountRow, ICategory } from '@models/index';

export type ISubRow = {
  _id?: Types.ObjectId;
  id?: string;
  accountRow: PopulatedDoc<IAccountRow['_id'] & IAccountRow>;
  category?: PopulatedDoc<ICategory['_id'] & ICategory>;
  extra: boolean;
  amount: number;
  amountf: string;
};

const SubRowSchema = new Schema<ISubRow>(
  {
    accountRow: {
      type: Schema.Types.ObjectId,
      ref: 'AccountRow',
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    extra: {
      type: Boolean,
      required: true,
      default: false,
    },
    amount: {
      type: Number,
      required: true,
      default: 0.0,
    },
  },
  {
    toObject: {
      virtuals: true,
    },
  }
);

SubRowSchema.virtual('amountf').get(function () {
  return this.amount.toLocaleString('sv-SE', { minimumFractionDigits: 2 });
});

export default (models.SubRow as Model<ISubRow>) ||
  model<ISubRow>('SubRow', SubRowSchema);
