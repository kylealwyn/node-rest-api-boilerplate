import User from '../models/user';
import { Router } from 'express';
import config from '../config/environment';
import jwt from 'jsonwebtoken';
import auth from '../lib/auth';
import { respond } from '../lib/util';
// BASE: /users

let router = Router();

/**
 * List All Users
 */
router.get('/', (req, res) => {
  User.find({}, { password: 0, salt: 0 }, respond(res, 200));
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
  newUser.save(function (err, user) {
    if (err) {
      return res.status(400).json(err);
    }

    let token = jwt.sign({ _id: user._id }, config.secrets.session, {
      expiresIn: 60 * 60 * 24 * 7 // 1 week
    });

    res.json({ token });
  });
});
module.exports = router;