// setup mongodb config - connection
//When setting up mongodb connection using mongoose, the mongoose connect method which takes in a database string is used.
//`mongoose.connect('mongodb://localhost:27017/<your-database-name>')`
//If you use a more recent version of mongoose and you get the error with mongodb connection, just change `localhost` to `127.0.0.1`.
//`mongoose.connect('mongodb://127.0.0.1:27017/<your-database-name>')`

import mongoose from 'mongoose';
import { config } from './config';
import Logger from 'bunyan';

const log: Logger = config.createLogger('database');
export default function connectDB() {
  const connect = () => {
    mongoose
      .connect(`${config.DATABASE_URL}`)
      .then(() => {
        log.info('MongoDB Connected...');
      })
      .catch((error) => {
        log.error('Error: MongoDB Connection Failed... at ', error);
        process.exit(1);
      });
  };
  connect();
  mongoose.connection.on('disconnected', connect);
}
