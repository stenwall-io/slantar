import { Schema, Model, model, models, Types, PopulatedDoc } from 'mongoose';

export interface IMonth {
  _id: Types.ObjectId;
  id: string;
  name: string;
  startDate: Date;
  nextMonth: PopulatedDoc<IMonth['_id'] & IMonth>;
}

const MonthSchema = new Schema<IMonth>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  nextMonth: {
    type: Schema.Types.ObjectId,
    ref: 'Month',
  },
});

export default (models.Month as Model<IMonth>) ||
  model<IMonth>('Month', MonthSchema);
