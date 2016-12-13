import BaseController from './base.controller';
import User from '../models/user';

class UsersController extends BaseController {
  constructor() {
    super();

    this.search = this.search.bind(this);
    this.fetch = this.fetch.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);

    this.whitelist = ['firstname', 'lastname', 'email', 'username', 'password']
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
        res.status(400).json(this.formatApiError(err));
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

  create(req, res) {
    const params = this.filterParams(req.body, this.whitelist);

    const newUser = new User(params);
    newUser.provider = 'local';
    newUser.save()
      .then(savedUser => {
        const token = savedUser.generateToken()

        req.session.authorization = token;
        req.session.user = savedUser;

        res.status(201).json({ token });
      })
      .catch(err => {
        res.status(400).json(this.formatApiError(err));
      });
  }

  update(req, res) {
    if (!req.currentUser) {
      return res.sendStatus(403);
    }

    const params = this.filterParams(req.body, this.whitelist);

    Object.assign(req.currentUser, params);
    req.currentUser.save()
      .then(() => res.sendStatus(204))
      .catch(err => res.status(400).json(this.formatApiError(err)));
  }

  delete(req, res) {
    if (!req.currentUser) {
      return res.sendStatus(403);
    }

    req.currentUser.remove()
      .then(() => res.sendStatus(204))
      .catch(err => {
        res.status(400).json(this.formatApiError(err));
      })
  }
}

export default new UsersController();
