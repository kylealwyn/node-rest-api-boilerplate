import User from '../models/user';
import { Router } from 'express';
import config from '../config/environment';
import jwt from 'jsonwebtoken';
// BASE: /users

let router = Router();

router.post('/', createUser);

function createUser(req, res, next) {
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
}

module.exports = router;