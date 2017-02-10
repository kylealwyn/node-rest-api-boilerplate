import Constants from '../config/constants';

export default function errorHandler(err, req, res, next) {
  if (!err) {
    return next();
  }

  const error = {
    message: err.message || 'Internal Server Error.',
  };

  // Only add data if there is data
  if (err.errors) {
    error.errors = err.errors;
  }

  // Print stack to console in development
  if (Constants.envs.development) {
    console.log(err.stack); // eslint-disable-line no-console
  }

  res.status(err.statusCode || err.status || 500).json(error);
}
