const objection = require('objection');
import knex from 'knex';
import config from '../knexfile';

const connection = knex(config[process.env.NODE_ENV || 'development']);
objection.Model.knex(connection);

export default connection;
