module.exports = {
  apps: [
    {
      name: 'API',
      script: 'build/server.js',
      env: {
        COMMON_VARIABLE: 'true',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  deploy: {
    dev: {
      'user': 'deploy',
      'host': 'aws',
      'ref': 'origin/deploy',
      'repo': 'https://github.com/kylealwyn/node-rest-api-boilerplate.git',
      'path': '/var/www/node-boilerplate',
      'post-deploy': 'npm run package && npm run serve:dev',
      'env': {
        NODE_ENV: 'development',
      },
    },
    production: {
      'user': 'node',
      'host': '212.83.163.1',
      'ref': 'origin/master',
      'repo': 'git@github.com:repo.git',
      'path': '/var/www/production',
      'post-deploy': 'npm install --productoin && ',
    },
  },
};
