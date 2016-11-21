import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import Constants from '../config/constants';

// BASE: /auth
const authRoute = new Router();

/**
 * Login with email
 */
authRoute.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    const error = err || info;

    if (error) {
      return res.status(401).json(error);
    } else if (!user) {
      return res.status(404).json({ success: false, message: 'Please verify you are using the correct credentials.' });
    }

    const token = user.generateToken();
    res.json({ token });
  })(req, res, next);
});

/**
 * Create User
 */
authRoute.post('/register/email', (req, res) => {
  const newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save((err, user) => {
    if (err) {
      return res.status(400).json(err);
    }

    const token = user.generateToken();
    res.json({ token });
  });
});

export default authRoute;
