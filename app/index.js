require('babel-polyfill');

// Load environment variables
require('dotenv').config();

// Initialize Database
require('./database');

// Initialize Server
require('./server');
