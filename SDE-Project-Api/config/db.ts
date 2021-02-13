const mongoose = require('mongoose')
import config from './config';

const connectDB = async() => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })

    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch(err) {
    console.error(err)
    process.exit(1)
  }
}

export const connect = () => {
  return connectDB();
};
