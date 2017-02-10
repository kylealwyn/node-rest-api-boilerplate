import { Router } from 'express';

// Controllers
import MetaController from './controllers/meta.controller';
import AuthController from './controllers/auth.controller';
import UsersController from './controllers/users.controller';
import ServicesController from './controllers/services.controller';

// Middlewares
import authenticate from './middleware/authenticate';
import accessControl from './middleware/access-control';
import errorHandler from './middleware/error-handler';

const routes = new Router();

monkeyPatchRouteMethods(routes);

routes.get('/', MetaController.index);

// Authentication
routes.post('/auth/login', AuthController.login);

// Users
routes.post('/users', UsersController.create);
routes.get('/users/me', authenticate, UsersController.fetch);
routes.patch('/users/me', authenticate, UsersController.update);
routes.delete('/users/me', authenticate, UsersController.delete);

// Services
routes.get('/services', ServicesController.search);
routes.get('/services/:code', ServicesController.fetch);

// @TODO
// routes.get('/products', ProductsController.search);

// Admin
routes.get('/admin', accessControl('admin'), MetaController.index);

// Error Handler
routes.use(errorHandler);

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
