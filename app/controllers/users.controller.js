import BaseController from './base.controller';
import User from '../models/User';

class UsersController extends BaseController {

  _populate = async (req, res, next) => {
    const user = await User.query().findById(req.params.id);

    if (!user) {
      return res.sendStatus(404);
    }

    req.user = user;
    next();
  }

  search = async (req, res, next) => {
    const users = await User.query();
    return res.json(users);
  }

  fetch = (req, res) => {
    const user = req.user || req.currentUser;

    if (!user) {
      return res.sendStatus(404);
    }

    res.json(user);
  }

  create = async (req, res, next) => {
    const user = await User
      .query()
      .insert(req.body);

    return res.status(201).json({
      user,
      token: user.generateToken(),
    });
  }

  update = async (req, res, next) => {
    if (!req.currentUser) {
      return res.sendStatus(403);
    }

    await req.currentUser
      .$query()
      .patch(req.body);

    res.json(req.currentUser);
  }

  delete = async (req, res, next) => {
    if (!req.currentUser) {
      return res.sendStatus(403);
    }

    await req.currentUser.destroy();
    res.sendStatus(204);
  }
}

export default new UsersController();
