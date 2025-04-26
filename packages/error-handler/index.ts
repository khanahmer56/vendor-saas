export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;
  constructor(
    message: string,
    statusCode: number,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this);
  }
}
export class NotFoundError extends AppError {
  constructor(message: "Resource not found") {
    super(message, 404);
  }
}
export class UnauthorizedError extends AppError {
  constructor(message: "Unauthorized") {
    super(message, 401);
  }
}
export class ForbiddenError extends AppError {
  constructor(message: "Forbidden") {
    super(message, 403);
  }
}
export class BadRequestError extends AppError {
  constructor(message: "Bad Request") {
    super(message, 400);
  }
}
export class InternalServerError extends AppError {
  constructor(message: "Internal Server Error") {
    super(message, 500);
  }
}
export class ValidationError extends AppError {
  constructor(message: "Invalid Request data", details?: any) {
    super(message, 400, true, details);
  }
}
export class RateLimitError extends AppError {
  constructor(message: "Too many requests") {
    super(message, 429);
  }
}
