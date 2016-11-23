import passport from 'passport';
import BaseController from './base.controller';

class AuthController extends BaseController {
  constructor() {
    super();
    this.login = this.login.bind(this);
  }

  login(req, res, next) {
    passport.authenticate('local', (err, user) => {
      if (err) {
        return res.status(401).json(err);
      }

      res.json({ token: user.generateToken() });
    })(req, res, next);
  }
}

export default new AuthController();
