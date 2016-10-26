import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { respondWithThing } from '../lib/util';
import Post from '../models/post';

// BASE: /posts
const postRoute = new Router();

/**
 * Get All Posts
 * TODO: Paginate this list and only find posts within 5 miles of request
 */
postRoute.get('/', authenticate, (req, res) => {
  Post
    .find({})
    .populate({ path: '_user', select: 'name' })
    .exec(respondWithThing(res, 200));
})

/**
 * Create Post
 */
postRoute.post('/', authenticate, (req, res) => {
  const post = new Post(req.body);
  post._user = req.currentUser._id;
  post.save()
    .then(() => {
      res.sendStatus(201)
    })
    .catch(err => {
      res.status(400).send(err)
    });
});

export default postRoute;
