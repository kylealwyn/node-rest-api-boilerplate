import jwt from 'jsonwebtoken';
import User from '../models/user';
import Constants from '../config/constants';

export default function authenticate(req, res, next) {
  const authorization = req.headers.authorization || req.session.authorization;

  if (!authorization) {
    const err = new Error('Token must be provided.')
    err.status = 401
    return next(err)
  }

  jwt.verify(authorization, Constants.security.sessionSecret, (err, decoded) => {
    if (err) {
      return next(err);
    }

    // If token is decoded successfully, find user and attach to our request
    // for use in our route or other middleware
    User.findById(decoded._id)
      .then(user => {
        if (!user) {
          const err = new Error('User not found.')
          err.status = 401
          return next(err)
        }

        req.currentUser = res.locals.user = user;

        next();
      })
      .catch(err => next(err));
  });
}
