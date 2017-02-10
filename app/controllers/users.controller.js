import User from '../models/User';
import { NotFound } from '../lib/errors';

class UsersController {
  fetch(req, res) {
    const user = req.user || req.currentUser;

    if (!user) {
      throw new NotFound();
    }

    res.json(user);
  }

  async create(req, res, next) {
    const user = await User
      .query()
      .insert(req.body);

    return res.status(201).json({
      user,
      token: user.generateToken(),
    });
  }

  async update(req, res, next) {
    await req.currentUser
      .$query()
      .patch(req.body);

    res.json(req.currentUser);
  }

  async delete(req, res, next) {
    await req.currentUser.destroy();
    res.sendStatus(204);
  }
}

export default new UsersController();
