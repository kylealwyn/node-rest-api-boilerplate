import path from 'path';
import {merge} from 'lodash';

// All configurations will extend these options
const defaultConfig = {
  env: process.env.NODE_ENV || 'development',
  get envs() {
    return {
      test: process.env.NODE_ENV === 'test',
      development: process.env.NODE_ENV === 'development',
      production: process.env.NODE_ENV === 'production',
    }
  },

  version: require('../../package.json').version,
  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 4567,
  ip: process.env.IP || '0.0.0.0',
  seedDB: false,
  userRoles: ['user', 'admin'],
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost/development',
    options: {
      db: {
        safe: true
      }
    }
  },
  security: {
    sessionSecret: process.env.SESSION_SECRET || 'i-am-the-secret-key',
    sessionExpiration: process.env.SESSION_EXPIRATION || 60 * 60 * 24 * 7, // 1 week
    saltRounds: process.env.SALT_ROUNDS || 12
  },
  apiPrefix: '/api'
};

// Environment specific configurations will be deeply merged into defaults
const environmentConfigs = {
  development: {
    security: {
      saltRounds: 4
    },
    seedDB: true
  },
  test: {
    port: 5678,
    mongo: {
      uri: 'mongodb://localhost/test'
    },
    security: {
      saltRounds: 4
    }
  },
  production: {
    mongo: {
      uri: ''
    }
  }
};

// Merge default and environment config
export default merge(defaultConfig, environmentConfigs[process.env.NODE_ENV] || {});
