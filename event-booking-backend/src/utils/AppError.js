// Custom error class jisse hum status code ke saath error throw kar sakein
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default AppError;