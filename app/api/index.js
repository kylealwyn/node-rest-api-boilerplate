import { Router } from 'express';
import auth from './auth';
import posts from './posts';
import users from './users';

const router = new Router();

router.use('/auth', auth);
router.use('/posts', posts);
router.use('/users', users);

// perhaps expose some API metadata at the root
router.get('/', (req, res) => {
	res.json({
		version : '1.0'
	});
});

export default router;
