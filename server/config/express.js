import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import errorHandler from 'errorhandler';
import morgan from 'morgan';
import passport from 'passport';

import strategies from './passport';
import middleware from '../middleware';
import api from '../api';

export default function () {
  var app = express();

  // Create HTTP Server
  app.server = http.createServer(app);

  app.use(cors({ exposedHeaders: ['Link'] }));

  // Logger
  app.use(morgan('dev'));

  // Add more routes to HTTP
  app.use(methodOverride());

  // Decode JSON
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Mount all middleware
  app.use(middleware());

  // Setup Passport
  app.use(passport.initialize());
  strategies();

  // Mount Routes
  app.use('/', api());

  if ('development' == app.get('env')) {
  	app.use(errorHandler());
  }

  app.server.listen(process.env.PORT || 8000);
  console.log(`Magic happening on port ${app.server.address().port}`);
  return app;

}
