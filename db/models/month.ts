import { Schema, Model, model, models, Types, PopulatedDoc } from 'mongoose';

export interface IMonth {
  _id?: Types.ObjectId;
  id?: string;
  year: number;
  month: number;
  startDate: Date;
}

const MonthSchema = new Schema<IMonth>({
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
});

export default (models.Month as Model<IMonth>) ||
  model<IMonth>('Month', MonthSchema);
