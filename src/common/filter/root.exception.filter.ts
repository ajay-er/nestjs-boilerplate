/**
 * Exception filter for handling custom RootException errors.
 *
 * This filter catches instances of RootException or its subclasses thrown within
 * NestJS controllers or middleware, and provides a structured error response in
 * a predefined format.
 *
 * It converts RootException instances into an `AppResponse` object with a standardized
 * error payload (`ExceptionPayload`), containing details such as error code and message.
 *
 * @remarks
 * The `catch` method extracts the error details from the RootException instance,
 * constructs an appropriate error payload, and returns an HTTP response with the
 * error status code and the serialized error response.
 *
 * @implements ExceptionFilter
 */
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch } from '@nestjs/common';
import type { Response } from 'express';

import { RootException } from '@/common/error';
import type { AppResponse, ExceptionPayload } from '@/common/types';

@Catch(RootException)
export class RootExceptionFilter implements ExceptionFilter {
  /**
   * Catches and handles RootException instances.
   *
   * @param exception - The RootException instance thrown.
   * @param host - Arguments host containing request and response objects.
   * @returns HTTP response with an error payload.
   */
  catch(exception: RootException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response: Response = context.getResponse<Response>();

    // Extract HTTP status code and error payload from RootException
    const responseStatusCode = exception.statuscode;
    const responseErrorPayload: ExceptionPayload = exception.payload;

    // Construct error response object
    const exceptionResponse: AppResponse = {
      success: false,
      data: null, // No data as error response
      error: responseErrorPayload, // Error details
    };

    // Send JSON response with error details
    return response.status(responseStatusCode).json(exceptionResponse);
  }
}
