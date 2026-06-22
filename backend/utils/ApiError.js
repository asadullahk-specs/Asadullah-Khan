// Lightweight typed error so controllers can do:
//   throw new ApiError(404, 'Project not found')
// and the central error handler will respond with the right status code.
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ApiError;
