import BaseController from './base.controller';
import User from '../models/user';

class UsersController extends BaseController {

  whitelist = ['firstname', 'lastname', 'email', 'username', 'password']

  _populate = async (req, res, next) => {
    const { username } = req.params;

    try {
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      req.user = user;
      next();
    } catch(err) {
      res.status(400).json(this.formatApiError(err));
    }
  }

  search = async (req, res) => {
    try {
      const users = await User.find({});
      res.json(users);
    } catch(err) {
      res.status(400).json(this.formatApiError(err));
    }
  }

  fetch = (req, res) => {
    const user = req.user || req.currentUser;

    if (!user) {
      return res.sendStatus(404);
    }

    res.json(user);
  }

  create = async (req, res) => {
    const params = this.filterParams(req.body, this.whitelist);

    let user = new User({
      ...params,
      provider: 'local',
    });

    try {
      user = await user.save();
      const token = user.generateToken();
      res.status(201).json({ token });
    } catch(err) {
      res.status(400).json(this.formatApiError(err));
    }
  }

  update = async (req, res) => {
    if (!req.currentUser) {
      return res.sendStatus(403);
    }

    const attrs = this.filterParams(req.body, this.whitelist);
    const user = Object.assign({}, req.currentUser, attrs);

    try {
      await user.save();
      res.sendStatus(204);
    } catch (err) {
      res.status(400).json(this.formatApiError(err));
    }
  }

  delete = async (req, res) => {
    if (!req.currentUser) {
      return res.sendStatus(403);
    }

    try {
      await req.currentUser.remove();
      res.sendStatus(204);
    } catch(err) {
      res.status(400).json(this.formatApiError(err));
    }
  }
}

export default new UsersController();
