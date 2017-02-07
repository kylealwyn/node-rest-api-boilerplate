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
import bookshelf from 'bookshelf';
import config from '../knexfile';

const Bookshelf = bookshelf(knex(config[process.env.NODE_ENV || 'development']));

Bookshelf.plugin('registry');
Bookshelf.plugin('visibility');
Bookshelf.Model = require('./models/base.model').default(Bookshelf);

export default Bookshelf;
