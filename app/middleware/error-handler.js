import Constants from '../config/constants';

export default function errorHandler(err, req, res, next) {
  if (!err) {
    return res.sendStatus(500);
  }

  const { message } = err;

  if (message === 'EmptyResponse') {
    return res.sendStatus(404);
  }

  const error = {
    message: message || 'Internal Server Error.',
  };

  if (Constants.envs.development) {
    console.log(err.stack); // eslint-disable-line no-console
  }

  if (err.errors) {
    error.errors = {};
    const { errors } = err;
    for (const type in errors) {
      if (type in errors) {
        error.errors[type] = errors[type].message;
      }
    }
  }

  res.status(err.statusCode || 500).json({
    ...error,
    data: err.data,
  });
}
