/**
 * Standardizes API error format to send back to clientID
 * @param  {error} err    native error
 * @param  {number} status HTTP status code
 * @param  {object} res    express response object
 * @return {object}        formatted json error
 */
export function formatApiError(err) {
  if (!err) {
    throw new Error('Provide an error.');
  }

  const formatted = {
    message: err.message
  };

  if (err.errors) {
    formatted.errors = {};
    const errors = err.errors;
    for (const type in errors) {
      formatted.errors[type] = errors[type].message
    }
  }

  return formatted;
}
