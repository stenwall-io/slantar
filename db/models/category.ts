import { Schema, Model, model, models, Types } from 'mongoose';

export interface ICategory {
  _id?: Types.ObjectId;
  id?: string;
  name: string;
  group: string;
}

const CategorySchema = new Schema<ICategory>({
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

export default (models.Category as Model<ICategory>) ||
  model<ICategory>('Category', CategorySchema);
