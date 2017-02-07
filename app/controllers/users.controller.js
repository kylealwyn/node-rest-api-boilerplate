import BaseController from './base.controller';
import User from '../models/user.model';

class UsersController extends BaseController {

  whitelist = [
    'firstname',
    'lastname',
    'email',
    'username',
    'password',
  ];

  _populate = async (req, res, next) => {
    try {
      const { username } = req.params;
      req.user = await User.findOne({ username });
      next();
    } catch(err) {
      next(err);
    }
  }

  search = async (req, res, next) => {
    try {
      const users = await User.findAll();
      return res.json(users);
    } catch(err) {
      next(err);
    }
  }

  fetch = (req, res) => {
    const user = req.user || req.currentUser;

    if (!user) {
      return res.sendStatus(404);
    }

    res.json(user);
  }

  create = async (req, res, next) => {
    const params = this.filterParams(req.body, this.whitelist);


    try {
      const user = await User.create({ ...params });

      return res.status(201).json({
        user,
        token: user.generateToken(),
      });
    } catch(err) {
      err.status = 400;
      next(err);
    }
  }

  update = async (req, res, next) => {
    const attributes = this.filterParams(req.body, this.whitelist);

    try {
      await req.currentUser.save(attributes, { patch: true });
      res.status(200).json(req.currentUser);
    } catch (err) {
      next(err);
    }
  }

  delete = async (req, res, next) => {
    if (!req.currentUser) {
      return res.sendStatus(403);
    }

    try {
      await req.currentUser.destroy();
      res.sendStatus(204);
    } catch(err) {
      next(err);
    }
  }
}

export default new UsersController();
