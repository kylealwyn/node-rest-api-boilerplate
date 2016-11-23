import { Router } from 'express';
import passport from 'passport';

import User from '../models/user';
import {formatApiError} from '../lib/error';

// BASE: /auth
const authRoute = new Router();

/**
 * Login with email
 */
authRoute.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return res.status(401).json(err);
    }

    res.json({ token: user.generateToken() });
  })(req, res, next);
});

/**
 * Create User
 */
authRoute.post('/register/email', (req, res) => {
  const user = new User(req.body);
  user.provider = 'local';
  user.save()
    .then(saved => {
      res.status(201).json({ token: saved.generateToken() });
    })
    .catch(err => {
      res.status(400).json(formatApiError(err));
    });
});

export default authRoute;
