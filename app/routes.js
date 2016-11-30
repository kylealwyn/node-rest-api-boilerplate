import { Router } from 'express';

import AuthController from './controllers/auth.controller';
import MetaController from './controllers/meta.controller';
import PagesController from './controllers/pages.controller';
import PostsController from './controllers/posts.controller';
import UsersController from './controllers/users.controller';


import authenticate from './middleware/authenticate';

const routes = new Router();

/**
 * View Routes. Will only render HTML
 */
routes.get('/', PagesController.index)

/**
 * API Routes. Will only render JSON
 */
const API_PREFIX = '/api'
routes.get(`${API_PREFIX}`, MetaController.index);

// Authentication
routes.post(`${API_PREFIX}/auth/login`, AuthController.login);
routes.post(`${API_PREFIX}/auth/logout`, AuthController.logout);

// Users
routes.get(`${API_PREFIX}/users`, UsersController.search);
routes.post(`${API_PREFIX}/users`, UsersController.create);
routes.get(`${API_PREFIX}/users/me`, authenticate, UsersController.fetch);
routes.put(`${API_PREFIX}/users/me`, authenticate, UsersController.update);
routes.delete(`${API_PREFIX}/users/me`, authenticate, UsersController.delete);
routes.get(`${API_PREFIX}/users/:username`, UsersController._populate, UsersController.fetch)

// Post
routes.get(`${API_PREFIX}/posts`, PostsController.search);
routes.post(`${API_PREFIX}/posts`, authenticate, PostsController.create);
routes.get(`${API_PREFIX}/posts/:postId`, PostsController._populate, PostsController.fetch);
routes.delete(`${API_PREFIX}/posts/:postId`, authenticate, PostsController.delete);

export default routes;
