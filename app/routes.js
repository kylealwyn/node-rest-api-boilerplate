import { Router } from 'express';

// Controllers
import MetaController from './controllers/meta.controller';
import AuthController from './controllers/auth.controller';
import UsersController from './controllers/users.controller';
import PostsController from './controllers/posts.controller';
import ServicesController from './controllers/services.controller';

// Middlewares
import authenticate from './middleware/authenticate';
import accessControl from './middleware/access-control';

const routes = new Router();

monkeyPatchRouteMethods(routes);

routes.get('/', MetaController.index);

// Authentication
routes.post('/auth/login', AuthController.login);

// Users
routes.get('/users', UsersController.search);
routes.post('/users', UsersController.create);
routes.get('/users/me', authenticate, UsersController.fetch);
routes.put('/users/me', authenticate, UsersController.update);
routes.delete('/users/me', authenticate, UsersController.delete);
routes.get('/users/:id', UsersController._populate, UsersController.fetch);

// services
routes.get('/services', ServicesController.search);
routes.get('/services/:code', ServicesController.fetch);

// Post
routes.get('/posts', PostsController.search);
routes.post('/posts', authenticate, PostsController.create);
routes.get('/posts/:id', PostsController._populate, PostsController.fetch);
routes.delete('/posts/:id', authenticate, PostsController.delete);

// Admin
routes.get('/admin', accessControl('admin'), MetaController.index);

// Error Handler
routes.use((err, req, res, next) => {
  if (err) {
    res.status(err.statusCode || err.status || 500).send(err.data || err.message || {});
  } else {
    next();
  }
});

// Wrap each express route method with code that passes unhandled exceptions
// from async functions to the `next` callback. This way we don't need to
// wrap our route handlers in try-catch blocks.
function monkeyPatchRouteMethods(app) {
  ['get', 'put', 'post', 'delete', 'patch'].forEach(function(routeMethodName) {
    const originalRouteMethod = app[routeMethodName];

    app[routeMethodName] = function(...args) {
      const originalRouteHandler = args[args.length - 1];

      if (typeof originalRouteHandler === 'function') {
        // Overwrite the route handler.
        args[args.length - 1] = function(req, res, next) {
          const ret = originalRouteHandler.call(this, req, res, next);

          // If the route handler returns a Promise (probably an async function) catch
          // the error and pass it to the next middleware.
          return ret instanceof Promise ? ret.catch(next) : ret;
        };
      }

      return originalRouteMethod.apply(this, args);
    };
  });
}

export default routes;
