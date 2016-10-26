import { Router } from 'express';
import auth from './auth';
import posts from './posts';
import users from './users';

// Base: /api
const baseRoute = new Router();

/**
 * Expose API Metadata at root
 */
baseRoute.get('/', (req, res) => {
	res.json({
		version : '1.0'
	});
});

baseRoute.use('/auth', auth);
baseRoute.use('/posts', posts);
baseRoute.use('/users', users);



export default baseRoute;
