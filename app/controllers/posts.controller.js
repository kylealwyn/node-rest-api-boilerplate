import BaseController from './base.controller';
import Post from '../models/post';

class PostController extends BaseController {
  constructor() {
    super();

    this.search = this.search.bind(this);
    this.fetch = this.fetch.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
  }

  /**
   * Middleware to populate post based on url param
   */
  _populate(req, res, next) {
    Post.findById(req.params.postId)
      .then(post => {
        if (!post) {
          return res.status(404).json({message: 'Post not found.'});
        }

        req.post = post;
        next();
      })
      .catch(() => res.sendStatus(400));
  }

  search(req, res) {
    Post
      .find({})
      .populate({ path: '_user', select: '-posts -role' })
      .then(posts => {
        res.status(200).json(posts);
      })
      .catch(err => {
        res.status(500).json(this.formatApiError(err));
      })
  }

  fetch(req, res) {
    res.json(req.post);
  }

  create(req, res) {
    const post = new Post(req.body);
    post._user = req.currentUser._id;
    post.save()
      .then(p => res.json(p))
      .catch(err => res.status(400).json(err));
  }

  delete(req, res) {
    // toString is necessary to convert ObjectIDs to normal Strings
    if (req.post._user.toString() === req.currentUser._id.toString()) {
      req.post.remove()
        .then(() => res.sendStatus(204))
        .catch(() => res.sendStatus(500))
    } else {
      res.sendStatus(403);
    }
  }
}

export default new PostController();
