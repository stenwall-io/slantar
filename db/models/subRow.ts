import { Schema, Model, model, models, Types, PopulatedDoc } from 'mongoose';
import { IAccountRow, ICategory } from '@models/index';

export interface ISubRow {
  _id?: Types.ObjectId;
  id?: string;
  accountRow: PopulatedDoc<IAccountRow['_id'] & IAccountRow>;
  category: PopulatedDoc<ICategory['_id'] & ICategory>;
  amount: number;
}

const SubRowSchema = new Schema<ISubRow>({
  accountRow: {
    type: Schema.Types.ObjectId,
    ref: 'AccountRow',
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  amount: {
    type: Number,
    required: true,
    default: 0.0
  },
});

export default (models.SubRow as Model<ISubRow>) ||
  model<ISubRow>('SubRow', SubRowSchema);
