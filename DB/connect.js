import mongoose from 'mongoose';

const connectDB = (url) => {
  mongoose.set('strictQuery', false)
  // mongoose.set('useNewUrlPerser', true)
  // mongoose.set('useUnifiedTopology: true', false)
    return mongoose.connect(url);
  };
  
  export default  connectDB;