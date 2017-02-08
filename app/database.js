// import mongoose from 'mongoose';
// import Constants from './config/constants';

// // Use native promises
// mongoose.Promise = global.Promise;
//
// // Connect to our mongo database;
// mongoose.connect(Constants.mongo.uri);
// mongoose.connection.on('error', (err) => {
//   throw err;
// });

const objection = require('objection');
import knex from 'knex';
import config from '../knexfile';

objection.Model.knex(knex(config[process.env.NODE_ENV || 'development']));
