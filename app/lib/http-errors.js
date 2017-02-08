import HttpStatus from 'http-status';

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export function Unauthorized(message) {
  return createError(message, HttpStatus.UNAUTHORIZED);
}

export function BadRequest(message) {
  return createError(message, HttpStatus.BAD_REQUEST);
}
