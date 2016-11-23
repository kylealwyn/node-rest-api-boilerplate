import { Router } from 'express';

import MetaController from './controllers/meta.controller';
import AuthController from './controllers/auth.controller';
import UsersController from './controllers/users.controller';
import PostsController from './controllers/posts.controller';

import authenticate from './middleware/authenticate';

const routes = new Router();

routes.get('/', MetaController.index);

// Authentication
routes.post('/auth/login', AuthController.login);
routes.post('/auth/register/email', AuthController.registerWithEmail);

// Users
routes.get('/users', UsersController.search);
routes.get('/users/me', authenticate, UsersController.fetch);
routes.put('/users/me', authenticate, UsersController.update);
routes.delete('/users/me', authenticate, UsersController.delete);
routes.get('/users/:username', UsersController._populate, UsersController.fetch)

// Post
routes.get('/posts', PostsController.search);
routes.post('/posts', authenticate, PostsController.create);
routes.get('/posts/:postId', PostsController._populate, PostsController.fetch);
routes.delete('/posts/:postId', authenticate, PostsController.delete);

export default routes;
