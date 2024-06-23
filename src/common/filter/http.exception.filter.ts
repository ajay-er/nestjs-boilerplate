/**
 * Exception filter for handling HTTP exceptions.
 *
 * This filter catches instances of HttpException or its subclasses thrown within
 * NestJS controllers or middleware, and provides a structured error response in
 * a predefined format.
 *
 * It converts HttpException instances into an `AppResponse` object with a standardized
 * error payload (`ExceptionPayload`), containing details such as error code and message.
 *
 * @remarks
 * The `catch` method extracts the error details from the HttpException instance,
 * constructs an appropriate error payload, and returns an HTTP response with the
 * error status code and the serialized error response.
 *
 * @implements ExceptionFilter
 */
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException } from '@nestjs/common';
import type { Response } from 'express';

import type { ExceptionPayload } from '@/common/error';
import type { AppResponse } from '@/common/types';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly unknownCode = 'Unknown';

  /**
   * Catches and handles HttpException instances.
   *
   * @param exception - The HttpException instance thrown.
   * @param host - Arguments host containing request and response objects.
   * @returns HTTP response with an error payload.
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response: Response = context.getResponse<Response>();

    // Extract error response from HttpException
    const exceptionResponse = exception.getResponse();
    let message = exceptionResponse;

    // If the response is an object with a 'message' property, extract it
    if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
      message = (exceptionResponse as any).message;
    }

    // Extract HTTP status code from HttpException
    const responseStatusCode = exception.getStatus();

    // Construct error payload
    const responseErrorPayload: ExceptionPayload = {
      code: this.unknownCode, // Module-specific error code
      message: message, // Error message or type
    };

    // Construct response object
    const exceptionResponsePayload: AppResponse = {
      success: false,
      data: null, // No data as error response
      error: responseErrorPayload, // Error details
    };

    // Send JSON response with error details
    return response.status(responseStatusCode).json(exceptionResponsePayload);
  }
}
