import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { respondWithThing } from '../lib/util';
import Post from '../models/post';

// BASE: /posts
const postRoute = new Router();

/**
 * Middleware to populate post based on url param
 */
function populatePost(req, res, next) {
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

/**
 * Get All Posts
 */
postRoute.get('/', authenticate, (req, res) => {
  Post
    .find({})
    .populate({ path: '_user', select: '-posts -role' })
    .exec(respondWithThing(res, 200));
});

/**
 * Get Post By Id
 */
postRoute.get('/:postId', authenticate, populatePost, (req, res) => {
  res.json(req.post);
});


/**
 * Create Post
 */
postRoute.post('/', authenticate, (req, res) => {
  const post = new Post(req.body);
  post._user = req.currentUser._id;
  post.save()
    .then(p => res.json(p))
    .catch(err => res.status(400).json(err));
});

/**
 * Delete Post
 */
postRoute.delete('/:postId', authenticate, populatePost, (req, res) => {
  // toString is necessary to convert ObjectIDs to normal Strings
  if (req.post._user.toString() === req.currentUser._id.toString()) {
    req.post.remove()
      .then(() => res.sendStatus(204))
      .catch(() => res.sendStatus(500))
  } else {
    res.sendStatus(403);
  }
});

export default postRoute;
