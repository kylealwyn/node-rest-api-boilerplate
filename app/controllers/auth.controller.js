import UserModel from '../models/user';
import BaseController from './base.controller';

class AuthController extends BaseController {
  login = (req, res) => {
    const { username, password } = req.body;

    UserModel.findOne({ username })
      .then((user) => {
        if (!user || !user.authenticate(password)) {
          return res.status(401).json({
            message: 'Please verify your credentials.',
          });
        }

        const token = user.generateToken();
        return res.status(200).json({ token });
      })
      .catch((err) => {
        res.status(500).json(this.formatApiError(err));
      });
  }
}

export default new AuthController();
