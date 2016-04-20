import _ from 'lodash';
import { isAuthenticated } from '../lib/auth';
import { respond } from '../lib/util';
import Post from '../models/post';
import { Router } from 'express';

// BASE: /posts

let router = Router();

/**
 * Create Post
 */
router.post('/', isAuthenticated(), (req, res, next) => {
  Post.create(req.body, respond(res, 201));
});



export default router;