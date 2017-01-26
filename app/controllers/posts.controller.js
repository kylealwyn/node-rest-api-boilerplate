import BaseController from './base.controller';
import Post from '../models/post';

class PostController extends BaseController {

  whitelist = [
    'text',
  ];

   // Middleware to populate post based on url param
  _populate = async (req, res, next) => {
    const { id } = req.params;

    try {
      const post = await Post.findById(id);

      if (!post) {
        const err = new Error('Post not found.');
        err.status = 404;
        return next(err);
      }

      req.post = post;
      next();
    } catch(err) {
      err.status = err.name ==='CastError' ? 404 : 500;
      next(err);
    }
  }

  search = async (req, res, next) => {
    try {
      const posts =
        await Post.find({})
                  .populate({ path: '_user', select: '-posts -role' });

      res.json(posts);
    } catch(err) {
      next(err);
    }
  }

  /**
   * req.post is populated by middleware in routes.js
   */

  fetch = (req, res) => {
    res.json(req.post);
  }

  /**
   * req.user is populated by middleware in routes.js
   */

  create = async (req, res, next) => {
    const params = this.filterParams(req.body, this.whitelist);

    const post = new Post({
      ...params,
      _user: req.currentUser._id,
    });

    try {
      res.status(201).json(await post.save());
    } catch(err) {
      next(err);
    }
  }

  delete = async (req, res, next) => {
    /**
     * Ensure the user attempting to delete the post owns the post
     *
     * ~~ toString() converts objectIds to normal strings
     */
    if (req.post._user.toString() === req.currentUser._id.toString()) {
      try {
        await req.post.remove();
        res.sendStatus(204);
      } catch(err) {
        next(err);
      }
    } else {
      res.sendStatus(403);
    }
  }
}

export default new PostController();
