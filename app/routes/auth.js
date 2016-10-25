import { Router } from 'express';
import { signToken } from '../lib/auth';
import passport from 'passport';

// BASE: /auth

let router = new Router();

/**
 * Login with email
 *
 */
router.post('/local', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    let  error = err || info;

    if (error) {
      return res.status(401).json(error);
    } else if (!user) {
      return res.status(404).json({message: 'Something went wrong, please try again.'});
    }

    res.status(200).json({ token: signToken(user._id, user.role) });
  })(req, res, next);
});

export default router;
