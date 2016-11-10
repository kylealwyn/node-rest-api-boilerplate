import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import errorHandler from 'errorhandler';
import morgan from 'morgan';
import passport from 'passport';
import helmet from 'helmet';

import {localStrategy} from './config/passport';
import middleware from './middleware';
import routes from './routes';

export default function () {
  const app = express();

  // Adds some security best practices
  app.use(helmet());
  app.use(cors({ exposedHeaders: ['Link'] }));

  // Logger
  app.use(morgan('dev'));

  // Properly Decode JSON
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Add all HTTP methods
  app.use(methodOverride());

  // Mount custom middleware
  app.use(middleware);

  // Setup Passport Authentication
  app.use(passport.initialize());
  passport.use(localStrategy);

  // Mount API with api subpath
  app.use('/', routes);

  if (app.get('env') === 'development') {
    app.use(errorHandler());
  }

  app.listen(process.env.PORT || 4444, () => {
    // Up and running!
    console.log(`we live fam.`);
  });
}
