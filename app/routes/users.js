import User from '../models/user';
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { respondWithStatus } from '../lib/util';
import { handleApiError } from '../lib/error';

// Base: /users
let userRoute = new Router();

function populateUser(req, res, next) {
  User.findOne({username: req.params.username})
    .then(user => {
      if (!user) {
        return res.status(404).json({message: 'User not found.'});
      }

      req.user = user;
      next();
    })
    .catch(err => handleApiError(err));
}

/**
 * List All Users
 * @todo Paginate list
 */
userRoute.get('/', authenticate, (req, res) => {
  User.find({})
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
 * Delete User
 */
userRoute.delete('/me', authenticate, (req, res) => {
  req.currentUser.remove(respondWithStatus(res, 204))
});

/**
 * Get User By Id
 */
userRoute.get('/:username', authenticate, populateUser, (req, res) => res.json(req.user));

export default userRoute;
