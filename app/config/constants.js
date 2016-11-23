import path from 'path';
import {mergeDeep} from '../lib/util'

const environmentSpecificConfig = {
  development: {
    mongo: {
      uri: 'mongodb://localhost/development'
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

// All configurations will extend these options
// ============================================
const defaultConfig = {
  env: process.env.NODE_ENV,
  get envs() {
    return {
      test: process.env.NODE_ENV === 'test',
      development: process.env.NODE_ENV === 'development',
      production: process.env.NODE_ENV === 'production',
    }
  },

  version: '1.0.0',
  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 4567,
  ip: process.env.IP || '0.0.0.0',
  seedDB: false,
  userRoles: ['guest', 'user', 'admin'],
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },
  security: {
    sessionSecret: 'i-am-the-secret-key',
    sessionExpiration: 60 * 60 * 24 * 7, // 1 week
    saltRounds: 12
  }
};

// Merge default and environment config
const config = mergeDeep(defaultConfig, environmentSpecificConfig[process.env.NODE_ENV]|| {});
export default config
