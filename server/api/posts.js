import resource from 'resource-router-middleware';
import _ from 'lodash';
import Post from '../models/post';

export default resource({

	/** Property name to store preloaded entity on `request`. */
	id : 'post',

	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
	load(req, id, done) {
		Post.findOne(id, (err, post) => done(err, post));
	},

	/** GET / - List all entities */
	index({ params }, res) {
		Post.find({}, (err, posts) => {
			res.json(posts);
		});
	},

	/** POST / - Create a new entity */
	create({ body }, res) {
		Post.create(body, (err, post) => {
			if (!err)
				res.send(post);
			else
				res.sendStatus(400);
		});
	},

	/** GET /:id - Return a given entity */
	read({ params }, res) {
		res.json(req.facet);
	},

	/** PUT /:id - Update a given entity */
	update({ post, body }, res) {
		console.log(post);
		post = _.assign(post, body);
		console.log(post);
		post.save(err => {
			if (err) {
				res.sendStatus(400);
			} else {
				res.sendStatus(204);
			}
		});

	},

	/** DELETE /:id - Delete a given entity */
	delete({ facet }, res) {
		posts.splice(posts.indexOf(facet), 1);
		res.sendStatus(204);
	}
});
