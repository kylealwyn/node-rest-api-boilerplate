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
      return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
    } else {
      // if everything is good, save to request for use in other routes
      User
        .findById(decoded._id)
        .exec()
        .then((user) => {
          req.currentUser = user
          next();
        })
        .catch((err) => {
          // console.log(err);
          return next(err);
        });
    }
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
