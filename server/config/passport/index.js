'use strict';

import { Router } from 'express';
import passport from 'passport';
import config from '../environment';
import User from '../../models/user';

module.exports = () => {
  require('./local').setup(User, config);
  // Passport Configuration

  // var router = Router();

  // router.use('/local', require('./local'));
  // router.use('/facebook', require('./facebook'));

  // module.exports = router;
}


