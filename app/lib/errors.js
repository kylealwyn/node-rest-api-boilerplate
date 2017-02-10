import HttpStatus from 'http-status';

function createError(message, errors, statusCode) {
  if (typeof message === 'object') {
    errors = message;
    message = 'Something went wrong.';
  }

  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;

  return error;
}

export function Unauthorized(message, errors) {
  return createError(message, errors, HttpStatus.UNAUTHORIZED);
}

export function BadRequest(message, errors) {
  return createError(message, errors, HttpStatus.BAD_REQUEST);
}

export function NotFound(message, errors) {
  return createError(message, errors, HttpStatus.NOT_FOUND);
}

export function Forbidden(message, errors) {
  return createError(message, errors, HttpStatus.FORBIDDEN);
}
