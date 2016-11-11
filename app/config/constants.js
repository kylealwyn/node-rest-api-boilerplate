import path from 'path';

const environmentSpecificConfig = {
  development: {
    mongo: {
      uri: 'mongodb://localhost/development'
    },
    seedDB: true
  },
  test: {
    mongo: {
      uri: 'mongodb://localhost/test'
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
  sessionExpiry: 60 * 60 * 24 * 7, // 1 week,
  secrets: {
    session: 'i-am-the-secret-key' // This should be loaded in via the environment in production
  },
  userRoles: ['guest', 'user', 'admin'],
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },
  facebook: {
    clientID:     process.env.FACEBOOK_ID || 'id',
    clientSecret: process.env.FACEBOOK_SECRET || 'secret',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/facebook/callback'
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
export default Object.assign(defaultConfig, environmentSpecificConfig[process.env.NODE_ENV]|| {});
