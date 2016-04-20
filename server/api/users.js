import User from '../models/user';
import { Router } from 'express';
import config from '../config/environment';
import jwt from 'jsonwebtoken';
import { isAuthenticated, signToken } from '../lib/auth';
import { respond } from '../lib/util';

// BASE: /users

let router = Router();

/**
 * List All Users
 */
router.get('/', isAuthenticated(), (req, res) => {
  User.find({}, respond(res, 200));
});

/**
 * Get Personal Details
 */
router.get('/me', isAuthenticated(), (req, res) => {
  res.status(200).json(req.currentUser);
});

/**
 * Get User By Id
 */
router.get('/:id', (req, res) => {
  res.send('whaaat')
});

/**
 * Update User
 */
router.put('/:id', (req, res) => {
  res.send('whaaat')
})

/**
 * Create User
 */
router.post('/', (req, res) => {
  let newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save((err, user) => {
    if (err) {
      return res.status(400).json(err);
    }

    let token = jwt.sign({ _id: user._id, role: user.role }, config.secrets.session, {
      expiresIn: 1 // 60 * 60 * 24 * 30 // 1 Month
    });

    res.json({ token: signToken(user._id, user.role) });
  });
});

export default router;