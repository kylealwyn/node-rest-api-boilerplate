import User from '../models/user';
import BaseController from './base.controller';

class AuthController extends BaseController {
  constructor() {
    super();
    this.login = this.login.bind(this);
  }

  login(req, res) {
    const {username, password} = req.body;

    User.findOne({ username })
      .then(user => {
        if (!user || !user.authenticate(password)) {
          return res.status(401).json({message: 'Please verify your credentials.'});
        }

        return res.status(200).json({token: user.generateToken()});
      })
      .catch(err => { res.status(500).json(this.formatApiError(err)) });
  }
}

export default new AuthController();
