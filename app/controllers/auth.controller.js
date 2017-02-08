import BaseController from './base.controller';
import User from '../models/User';
import { Unauthorized, BadRequest } from '../lib/http-errors';

class AuthController extends BaseController {
  login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequest('You must provide an email and password.');
    }

    const user = await User
      .query()
      .where({ email })
      .first();

    if (!user || !user.authenticate(password)) {
      throw new Unauthorized();
    }

    return res.status(200).json({
      user,
      token: user.generateToken(),
    });
  }
}

export default new AuthController();
