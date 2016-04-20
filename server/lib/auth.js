'use strict';

import passport from 'passport';
import config from '../config/environment';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import compose from 'composable-middleware';
import User from '../models/user';

var validateJwt = expressJwt({
  secret: config.secrets.session
});

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
export function isAuthenticated() {
  return compose()
    // Validate jwt
    .use((req, res, next) => {
      req.headers.authorization = `Bearer ${req.headers.authorization}`
      validateJwt(req, res, next);
    })
    // Attach user to request
    .use((req, res, next) => {
      User.findById(req.user._id, (err, user) => {
        if (err) {
          return next(err);
        } else if (!user) {
          return res.status(401).end();
        }

        req.currentUser = user;
        next();
      });
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
      if (config.userRoles.indexOf(req.user.role) >=
          config.userRoles.indexOf(roleRequired)) {
        next();
      }
      else {
        res.sendStatus(403);
      }
    });
}

/**
 * Returns a jwt token signed by the app secret
 */
export function signToken(_id, role) {
  console.log('Signing log with secret ' + config.secrets.session);
  return jwt.sign({ _id, role }, config.secrets.session, {
    expiresIn: 60 * 60 * 24 * 7 // 1 week
  });
}