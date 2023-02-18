import { Schema, Model, model, models, Types } from 'mongoose';

export interface IMonth {
  _id?: Types.ObjectId;
  id?: string;
  year: number;
  month: number;
  name?: string;
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

export default (models.Month as Model<IMonth>) ||
  model<IMonth>('Month', MonthSchema);
