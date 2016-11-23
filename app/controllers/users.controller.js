import BaseController from './base.controller';
import User from '../models/user';

class UsersController extends BaseController {
  constructor() {
    super();
  }

  _populate(req, res, next) {
    const { username } = req.params;

    User.findOne({username})
      .then(user => {
        if (!user) {
          return res.status(404).json({message: 'User not found.'});
        }

        req.user = user;
        next();
      })
      .catch(err => {
        res.status(500).json(this.formatApiError(err));
      });
  }

  search(req, res) {
    User.find({})
      .then(users => {
        res.json(users);
      })
      .catch(err => {
        res.status(400).json(this.formatApiError(err));
      });
  }

  fetch(req, res) {
    let user = req.user || req.currentUser;

    if (!user) {
      return res.sendStatus(404);
    }

    res.json(user);
  }

  update(req, res) {
    if (!req.currentUser) {
      return res.sendStatus(403);
    }

    Object.assign(req.currentUser, req.body);
    req.currentUser.save(respondWithStatus(res, 204));
  }

  delete(req, res) {
    if (!req.currentUser) {
      return res.sendStatus(403);
    }

    req.currentUser.remove()
      .then(() => res.status(204))
      .catch(err => {
        res.status(400).json(this.formatApiError(err));
      })
  }
}

export default new UsersController();
