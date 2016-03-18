import { Router } from 'express';
import facets from './facets';
import posts from './posts';

export default function() {
	var api = Router();

	// mount the facets resource
	api.use('/facets', facets);
	api.use('/posts', posts);

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({
			version : '1.0'
		});
	});

	return api;
}
