import { Schema, Model, model, models, Types, PopulatedDoc } from 'mongoose';

export interface IRowClass {
  _id: Types.ObjectId;
  name: string;
  group: string;
}

const RowClassSchema = new Schema<IRowClass>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  group: {
    type: String,
    required: true,
    trim: true,
  },
});

export default (models.RowClass as Model<IRowClass>) ||
  model<IRowClass>('RowClass', RowClassSchema);
