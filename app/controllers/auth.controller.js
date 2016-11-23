import passport from 'passport';
import BaseController from './base.controller';
import User from '../models/user';

class AuthController extends BaseController {
  constructor() {
    super();
    this.login = this.login.bind(this);
    this.registerWithEmail = this.registerWithEmail.bind(this);
  }

  login(req, res, next) {
    passport.authenticate('local', (err, user) => {
      if (err) {
        return res.status(401).json(err);
      }

      res.json({ token: user.generateToken() });
    })(req, res, next);
  }

  registerWithEmail(req, res) {
    const newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.save()
      .then(savedUser => {
        res.status(201).json({ token: savedUser.generateToken() });
      })
      .catch(err => {
        res.status(400).json(this.formatApiError(err));
      });
  }
}

export default new AuthController();
