import { Router } from 'express';

export default function() {
	var api = Router();

  api.use('/auth', require('./auth'));
	api.use('/posts', require('./posts'));
  api.use('/users', require('./users'));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({
			version : '1.0'
		});
	});

	return api;
}
