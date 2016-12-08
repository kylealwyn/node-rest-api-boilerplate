import User from '../models/user';
import BaseController from './base.controller';

class AuthController extends BaseController {
  constructor() {
    super();

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  login(req, res) {
    const {username, password} = this.filterParams(req.body, ['username', 'password']);

    User.findOne({ username })
      .then(user => {
        if (!user || !user.authenticate(password)) {
          return res.status(401).json({message: 'Please verify your credentials.'});
        }

        const token = user.generateToken();

        req.session.authorization = token;
        req.session.user = user;

        return res.status(200).json({token});
      })
      .catch(err => {
        res.status(500).json(this.formatApiError(err))
      });
  }

  logout(req, res) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json(this.formatApiError(err));
      }

      res.redirect('/login');
    });
  }
}

export default new AuthController();
