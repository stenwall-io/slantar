import { Schema, Model, model, models, Types } from 'mongoose';

export interface ICategory {
  _id?: Types.ObjectId;
  id?: string;
  group: string;
  subgroup: string;
}

const CategorySchema = new Schema<ICategory>({
  group: {
    type: String,
    required: true,
    trim: true,
  },
  subgroup: {
    type: String,
    required: true,
    trim: true,
  },
});

export default (models.Category as Model<ICategory>) ||
  model<ICategory>('Category', CategorySchema);
