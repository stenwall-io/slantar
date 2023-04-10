import { Schema, Model, model, models, Types, PopulatedDoc } from 'mongoose';
import { IAccountRow } from '@models/index';

export interface IMonth {
  _id?: Types.ObjectId;
  id?: string;
  year: number;
  month: number;
  name?: string;
  accountrows: Types.Array<PopulatedDoc<IAccountRow['_id'] & IAccountRow>>;
}

const monthNames = [
  'januari',
  'februari',
  'mars',
  'april',
  'maj',
  'juni',
  'juli',
  'augusti',
  'september',
  'oktober',
  'november',
  'december',
];

const MonthSchema = new Schema<IMonth>({
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
    min: 0,
    max: 11,
  },
});

MonthSchema.virtual('name').get(function () {
  return `${monthNames[this.month]} ${this.year}`;
});

MonthSchema.virtual('accountrows', {
  ref: 'AccountRow',
  localField: '_id',
  foreignField: 'month',
});

MonthSchema.virtual('subrows', {
  ref: 'SubRow',
  localField: '_id',
  foreignField: 'accountRow.month',
});

MonthSchema.post('find', function () {
  this.populate('accountrows');
});

export default (models.Month as Model<IMonth>) ||
  model<IMonth>('Month', MonthSchema);
