import { ZodError } from 'zod';
import { ApiResponseBuilder } from './api-response';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function handleApiError(error: any) {
  console.error('API Error:', error);

  // Zod validation errors
  if (error instanceof ZodError) {
    const errors = error.issues.map((issue) => ({
      field: issue.path.map(String).join('.'),
      message: issue.message,
    }));
    return ApiResponseBuilder.badRequest('Validation failed', errors);
  }

  // Custom App errors
  if (error instanceof AppError) {
    return ApiResponseBuilder.error(error.message, error.statusCode);
  }

  // Mongoose validation errors
  if (error.name === 'ValidationError') {
    const errors = Object.keys(error.errors).map((key) => ({
      field: key,
      message: error.errors[key].message,
    }));
    return ApiResponseBuilder.badRequest('Validation failed', errors);
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return ApiResponseBuilder.badRequest(`${field} already exists`);
  }

  // Mongoose CastError
  if (error.name === 'CastError') {
    return ApiResponseBuilder.badRequest('Invalid ID format');
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return ApiResponseBuilder.unauthorized('Invalid token');
  }

  if (error.name === 'TokenExpiredError') {
    return ApiResponseBuilder.unauthorized('Token expired');
  }

  // Default error
  return ApiResponseBuilder.error(
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : error.message || 'Internal server error',
    500
  );
}
