import { Router } from 'express';

import AuthController from './controllers/auth.controller';
import MetaController from './controllers/meta.controller';
import PagesController from './controllers/pages.controller';
import PostsController from './controllers/posts.controller';
import UsersController from './controllers/users.controller';

import authenticate from './middleware/authenticate';
import Constants from './config/constants';

const prefix = Constants.apiPrefix;
const routes = new Router();

/**
 * View Routes. Will only render HTML
 */
routes.get('/', PagesController.index);
routes.get('/login', PagesController.login);

/**
 * API Routes. Will only render JSON
 */
routes.get(`${prefix}`, MetaController.index);

// Authentication
routes.post(`${prefix}/auth/login`, AuthController.login);
routes.get(`${prefix}/auth/logout`, AuthController.logout);

// Users
routes.get(`${prefix}/users`, UsersController.search);
routes.post(`${prefix}/users`, UsersController.create);
routes.get(`${prefix}/users/me`, authenticate, UsersController.fetch);
routes.put(`${prefix}/users/me`, authenticate, UsersController.update);
routes.delete(`${prefix}/users/me`, authenticate, UsersController.delete);
routes.get(`${prefix}/users/:username`, UsersController._populate, UsersController.fetch);

// Post
routes.get(`${prefix}/posts`, PostsController.search);
routes.post(`${prefix}/posts`, authenticate, PostsController.create);
routes.get(`${prefix}/posts/:postId`, PostsController._populate, PostsController.fetch);
routes.delete(`${prefix}/posts/:postId`, authenticate, PostsController.delete);

export default routes;
