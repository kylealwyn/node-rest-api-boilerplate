import BaseController from './base.controller';
import User from '../models/user.model';

class AuthController extends BaseController {
  login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        throw this.generateError('You must provide an email and password.', 400);
      }

      const user = await User.findOne({ email }, { require: false });

      if (!user || !user.authenticate(password)) {
        const err = new Error('Please verify your credentials.');
        err.status = 401;
        return next(err);
      }

      return res.status(200).json({
        user,
        token: user.generateToken(),
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
