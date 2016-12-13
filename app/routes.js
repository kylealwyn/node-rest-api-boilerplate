import { Router } from 'express';

import AuthController from './controllers/auth.controller';
import MetaController from './controllers/meta.controller';
import PagesController from './controllers/pages.controller';
import PostsController from './controllers/posts.controller';
import UsersController from './controllers/users.controller';

import authenticate from './middleware/authenticate';
import accessControl from './middleware/access-control';
import redirectAuthenticated from './middleware/redirect-authenticated';
import Constants from './config/constants';

const base = Constants.apiPrefix;
const routes = new Router();

/**
 * View Routes. Will only render HTML
 */
routes.get('/', redirectAuthenticated('/'), PagesController.index);
routes.get('/login', redirectAuthenticated('/'), PagesController.login);
routes.get('/register', redirectAuthenticated('/'), PagesController.register);

routes.get('/admin', accessControl('admin'), PagesController.admin);

/**
 * API Routes. Will only render JSON
 */
routes.get(`${base}`, MetaController.index);

// Authentication
routes.post(`${base}/auth/login`, AuthController.login);
routes.get(`${base}/auth/logout`, AuthController.logout);

// Users
routes.get(`${base}/users`, UsersController.search);
routes.post(`${base}/users`, UsersController.create);
routes.get(`${base}/users/me`, authenticate, UsersController.fetch);
routes.put(`${base}/users/me`, authenticate, UsersController.update);
routes.delete(`${base}/users/me`, authenticate, UsersController.delete);
routes.get(`${base}/users/:username`, UsersController._populate, UsersController.fetch);

// Post
routes.get(`${base}/posts`, PostsController.search);
routes.post(`${base}/posts`, authenticate, PostsController.create);
routes.get(`${base}/posts/:postId`, PostsController._populate, PostsController.fetch);
routes.delete(`${base}/posts/:postId`, authenticate, PostsController.delete);

routes.get('*', PagesController.notFound);

export default routes;
