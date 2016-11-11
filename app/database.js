import mongoose from 'mongoose';
import constants from './config/constants';

// Use native promises
mongoose.Promise = global.Promise;

// Connect to our mongo database;
mongoose.connect(constants.mongo.uri);
mongoose.connection.on('error', (err) => { throw err; });
