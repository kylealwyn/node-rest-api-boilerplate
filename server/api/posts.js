import { Router } from 'express';
import { isAuthenticated } from '../lib/auth';
import { respond } from '../lib/util';
import Post from '../models/post';


// BASE: /posts

let router = Router();

/**
 * Get All Posts
 * TODO: Paginate this list and only find posts within 5 miles of request
 */
 router.get('/', isAuthenticated(), (req, res, next) => {
  Post
    .find({})
    .populate('_user')
    .exec(respond(res, 200));
 })

/**
 * Create Post
 */
router.post('/', isAuthenticated(), (req, res, next) => {
  let post = new Post(req.body);
  post._user = req.currentUser.id;
  post.save(respond(res, 201));
});



export default router;