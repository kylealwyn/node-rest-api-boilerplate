import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import errorHandler from 'errorhandler';
import morgan from 'morgan';
import helmet from 'helmet';

import initializePassport from './config/passport';
import routes from './routes';
import constants from './config/constants';
import './database';

let app = express();

// Adds some security best practices
app.use(helmet());
app.use(cors());

// Logger
if (!constants.envs.test) {
  app.use(morgan('dev'));
}

// Properly Decode JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add all HTTP methods
app.use(methodOverride());

// Setup Passport Authentication
app.use(initializePassport());

// Mount API routes
app.use('/', routes);

// Only use error handler in development
if (constants.envs.development) {
  app.use(errorHandler());
}

app.listen(constants.port, () => {
  // eslint-disable-next-line no-console
  console.log(`
    Port: ${constants.port}
    Env: ${app.get('env')}
  `);
});

export default app;
