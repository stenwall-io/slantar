import mongoose from 'mongoose';

const options: object = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI, options).then((mongoose) => {
  console.log('Connected to database');
  return mongoose;
});
