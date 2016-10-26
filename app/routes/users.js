import User from '../models/user';
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { respondWithStatus } from '../lib/util';
import { handleApiError } from '../lib/error';

// Base: /users
let userRoute = new Router();

function attachUser(req, res, next) {
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
 * @todo Paginate list
 */
userRoute.get('/', authenticate, (req, res) => {
  User.find({})
    .exec()
    .then(users => res.json(users))
    .catch(err => handleApiError(err, res))
});

/**
 * Get Personal Details
 */
userRoute.get('/me', authenticate, (req, res) => res.json(req.currentUser));

/**
 * Update User
 */
userRoute.put('/me', authenticate, (req, res) => {
  Object.assign(req.currentUser, req.body);
  req.currentUser.save(respondWithStatus(res, 204));
});

/**
 * Update User
 */
userRoute.delete('/me', authenticate, (req, res) => {
  req.currentUser.remove(respondWithStatus(res, 204))
});

/**
 * Get User By Id
 */
userRoute.get('/:id', authenticate, attachUser, (req, res) => res.json(req.user));

export default userRoute;
