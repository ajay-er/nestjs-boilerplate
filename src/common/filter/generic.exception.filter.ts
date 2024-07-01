/**
 * Exception filter for handling uncaught exceptions globally.
 *
 * This filter catches any unhandled exceptions thrown within NestJS controllers
 * and provides a structured error response in the specified format.
 *
 * It converts exceptions into an `AppResponse` object with a standardized error
 * payload (`ExceptionPayload`), containing details such as error code and message.
 *
 * @remarks
 * The `catch` method extracts the error details, constructs an appropriate error
 * payload, and returns an HTTP response with the error status code and the
 * serialized error response.
 *
 * @implements ExceptionFilter
 */
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch } from '@nestjs/common';
import type { Response } from 'express';

import type { AppResponse, ExceptionPayload } from '@/common/types';

@Catch()
export class GenericExceptionFilter implements ExceptionFilter {
  private readonly unknownCode = 'Unknown';

  /**
   * Catches and handles exceptions.
   *
   * @param exception - The unhandled exception object.
   * @param host - Arguments host containing request and response objects.
   * @returns HTTP response with an error payload.
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response: Response = context.getResponse<Response>();
    const errorMessage = this.getErrorMessage(exception);
    const responseStatusCode = 500;

    // Construct error payload
    const responseErrorPayload: ExceptionPayload = {
      code: this.unknownCode, // Module-specific error code
      message: errorMessage, // Error message or type
    };

    // Construct response object
    const exceptionResponse: AppResponse = {
      success: false,
      data: null, // No data as error response
      error: responseErrorPayload, // Error details
    };

    // Send JSON response with error details
    return response.status(responseStatusCode).json(exceptionResponse);
  }

  private getErrorMessage(exception: unknown): string {
    if (exception instanceof Error) {
      return exception.message || exception.name;
    } else if (typeof exception === 'object' && exception !== null) {
      return String(
        (exception as Record<string, unknown>).message || (exception as Record<string, unknown>).name || 'Unknown error'
      );
    }
    return 'Unknown error';
  }
}
