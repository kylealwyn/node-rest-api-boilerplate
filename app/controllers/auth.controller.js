import BaseController from './base.controller';
import User from '../models/user';

class AuthController extends BaseController {
  login = async (req, res, next) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });

      if (!user || !user.authenticate(password)) {
        const err = new Error('Please verify your credentials.');
        err.status = 401;
        return next(err);
      }

      const token = user.generateToken();
      return res.status(200).json({ token });
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
