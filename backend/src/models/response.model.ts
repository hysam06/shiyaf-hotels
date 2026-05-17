/**
 * API Response Models
 * Standardized response formats for all API endpoints
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

export class ResponseBuilder {
  /**
   * Build success response
   */
  static success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Build error response
   */
  static error(code: string, message: string, details?: any): ApiError {
    return {
      success: false,
      error: {
        code,
        message,
        details
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Build validation error response
   */
  static validationError(errors: any[]): ApiError {
    return this.error(
      'VALIDATION_ERROR',
      'Validation failed',
      errors
    );
  }

  /**
   * Build not found error
   */
  static notFound(resource: string): ApiError {
    return this.error(
      'NOT_FOUND',
      `${resource} not found`
    );
  }

  /**
   * Build unauthorized error
   */
  static unauthorized(message: string = 'Unauthorized access'): ApiError {
    return this.error(
      'UNAUTHORIZED',
      message
    );
  }

  /**
   * Build internal server error
   */
  static internalError(message: string = 'Internal server error'): ApiError {
    return this.error(
      'INTERNAL_ERROR',
      message
    );
  }
}

export default ResponseBuilder;
