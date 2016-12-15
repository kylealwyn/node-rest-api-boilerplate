import {Router} from 'express';

import MetaController from './controllers/meta.controller';
import AuthController from './controllers/auth.controller';
import UsersController from './controllers/users.controller';
import PostsController from './controllers/posts.controller';

import authenticate from './middleware/authenticate';
import constants from './config/constants';

const routes = new Router();
const prefix = constants.apiPrefix;

routes.get(`${prefix}/`, MetaController.index);

// Authentication
routes.post(`${prefix}/auth/login`, AuthController.login);

// Users
routes.get(`${prefix}/users`, UsersController.search);
routes.post(`${prefix}/users`, UsersController.create);
routes.get(`${prefix}/users/me`, authenticate, UsersController.fetch);
routes.put(`${prefix}/users/me`, authenticate, UsersController.update);
routes.delete(`${prefix}/users/me`, authenticate, UsersController.delete);
routes.get(`${prefix}/users/:username`, UsersController._populate, UsersController.fetch)

// Post
routes.get(`${prefix}/posts`, PostsController.search);
routes.post(`${prefix}/posts`, authenticate, PostsController.create);
routes.get(`${prefix}/posts/:postId`, PostsController._populate, PostsController.fetch);
routes.delete(`${prefix}/posts/:postId`, authenticate, PostsController.delete);

export default routes;
