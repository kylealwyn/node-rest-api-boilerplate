import User from '../models/user';
import Post from '../models/post';
import { Router } from 'express';
import config from '../config/environment';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { isAuthenticated, signToken } from '../lib/auth';
import { respond } from '../lib/util';

// BASE: /users

let router = Router();

function populate(req, res, next) {
  console.log('Populating..');
  User.findById(req.params.id, (err, user) => {
    if (err) {
      return res.status(400).send('Invalid ID.');
    }
    if (!user) {
      return res.status(404).send('User does not exist.');
    }

    req.user = user;
    next();
  });
}

/**
 * List All Users
 * TODO: Paginate
 */
router.get('/', isAuthenticated(), (req, res) => {
  User.find({}, (err, users) => {
    users.forEach(user => {
      Post.find({ _user: user }, (err, posts) => {
        console.log(posts);
        user.posts = posts;
        res.status(200).json(users);
      });
    });

  })
});

/**
 * Get Personal Details
 */
router.get('/me', isAuthenticated(), (req, res) => {
  res.status(200).json(req.currentUser);
});

/**
 * Update User
 */
router.put('/me', isAuthenticated(), (req, res) => {
  _.assign(req.currentUser, req.body);
  req.currentUser.save((err, user) => {
    if (err) {
      return res.status(400).send(err);
    }
    res.sendStatus(204);
  });
});

/**
 * Update User
 */
router.delete('/me', isAuthenticated(), (req, res) => {
  req.currentUser.remove((err) => {
    res.sendStatus(204);
  })
});

/**
 * Get User By Id
 */
router.get('/:id', isAuthenticated(), populate, (req, res) => {
  res.status(200).json(req.user);
});

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

    res.json({ token: signToken(user._id, user.role) });
  });
});

export default router;