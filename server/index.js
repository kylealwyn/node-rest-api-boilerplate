import database from './config/database';
import express from './config/express';

// connect to database then initialize app
database( λ => express() );
