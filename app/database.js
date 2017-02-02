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

import knex from 'knex';

export default knex({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'quickdoc_dev',
  },
  debug: true,
});
