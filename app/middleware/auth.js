import Constants from '../config/constants';
import jwt from 'jsonwebtoken';
import compose from 'composable-middleware';
import User from '../models/user';

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
export function authenticate(req, res, next) {
  const {authorization} = req.headers;
  jwt.verify(authorization, Constants.secrets.session, (err, decoded) => {
    if (err) {
      return res.sendStatus(401);
    }

    // If token is decoded successfully, find user and attach to our request
    // for use in our route or other middleware
    User
      .findById(decoded._id)
      .then((user) => {
        if (!user) {
          return res.sendStatus(401);
        }
        req.currentUser = user
        next();
      })
      .catch((err) => next(err));
  });
}


/**
 * Checks if the user role meets the minimum requirements of the route
 */
export function hasRole(roleRequired) {
  if (!roleRequired) {
    throw new Error('Required role needs to be set');
  }

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (Constants.userRoles.indexOf(req.user.role) >=
          Constants.userRoles.indexOf(roleRequired)) {
        next();
      }
      else {
        res.sendStatus(403);
      }
    });
}
