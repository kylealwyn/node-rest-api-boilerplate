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
    ip: process.env.IP || undefined,
    port: process.env.PORT || 8080,
    mongo: {
      uri: ''
    }
  }
};

// All configurations will extend these options
// ============================================
const defaultConfig = {
  env: process.env.NODE_ENV,
  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 9000,
  ip: process.env.IP || '0.0.0.0',
  seedDB: false,
  secrets: {
    session: 'angular-fullstack-secret'
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
