import { Schema, Model, model, models } from 'mongoose';

export interface IUser {
  _id: Schema.Types.ObjectId;
  username: string;
  password: string;
  name: string;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  
},{
  toObject: {
    transform: function (doc, ret) {
      delete ret.password;
    }
  }
});

export default (models.User as Model<IUser>) ||
  model<IUser>('User', UserSchema);
