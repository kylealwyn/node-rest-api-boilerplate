import BaseController from './base.controller';
import User from '../models/user';

class AuthController extends BaseController {
  login = async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });

      if (!user || !user.authenticate(password)) {
        return res.status(401).json({
          message: 'Please verify your credentials.',
        });
      }

      const token = user.generateToken();
      return res.status(200).json({ token });
    } catch (error) {
      res.status(500).json(this.formatApiError(error));
    }
  }
}

export default new AuthController();
