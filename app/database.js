import mongoose from 'mongoose';
import constants from './config/constants';

export default (callback) => {
  mongoose.Promise = global.Promise;
  mongoose.connect(constants.mongo.uri);
  mongoose.connection.on('error', (err) => console.log(err));
  mongoose.connection.on('open', callback);
}
