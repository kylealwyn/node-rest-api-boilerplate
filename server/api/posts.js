import _ from 'lodash';
import Auth from '../lib/auth';
import Post from '../models/post';
import { Router } from 'express';

// BASE: /posts

let router = Router();

router.post('/', Auth.isAuthenticated(), createPost);

function createPost(req, res, next) {
	Post.create(req.body, (err, post) => {
		if (!err) {
			res.json(post);
		} else {
			res.sendStatus(400);
		}
	});
}

module.exports = router;
// export default resource({

// 	/** Property name to store preloaded entity on `request`. */
// 	id : 'post',

// 	/** For requests with an `id`, you can auto-load the entity.
// 	 *  Errors terminate the request, success sets `req[id] = data`.
// 	 */
// 	load(req, id, done) {
// 		Post.findOne(id, (err, post) => done(err, post));
// 	},

// 	/** GET / - List all entities */
// 	index({ params }, res) {
// 		Post.find({}, (err, posts) => {
// 			res.json(posts);
// 		});
// 	},

// 	/** POST / - Create a new entity */
// 	create({ body }, res) {

// 	},

// 	/** GET /:id - Return a given entity */
// 	read({ params }, res) {
// 		res.json(req.facet);
// 	},

// 	/** PUT /:id - Update a given entity */
// 	update({ post, body }, res) {
// 		console.log(post);
// 		post = _.assign(post, body);
// 		console.log(post);
// 		post.save(err => {
// 			if (err) {
// 				res.sendStatus(400);
// 			} else {
// 				res.sendStatus(204);
// 			}
// 		});

// 	},

// 	/** DELETE /:id - Delete a given entity */
// 	delete({ facet }, res) {
// 		posts.splice(posts.indexOf(facet), 1);
// 		res.sendStatus(204);
// 	}
// });
