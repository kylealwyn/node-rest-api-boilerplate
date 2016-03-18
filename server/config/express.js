import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import errorHandler from 'errorhandler';
import morgan from 'morgan';

import middleware from '../middleware';
import api from '../api';

export default function () {
  var app = express();
  app.server = http.createServer(app);

  app.use(cors({ exposedHeaders: ['Link'] }));
  app.use(morgan('dev'));
  app.use(methodOverride());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(middleware());
  app.use('/api', api());

  if ('development' == app.get('env')) {
  	app.use(errorHandler());
  }

  app.server.listen(process.env.PORT || 8000);
  console.log(`Magic happening on port ${app.server.address().port}`);
  return app;

}
