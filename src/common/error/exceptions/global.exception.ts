/**
 * Custom exceptions with global exception codes for specific error scenarios.
 *
 * These custom exceptions extend a factory function `createException` to define
 * HTTP status codes, error messages, and unique error codes for each scenario.
 *
 * @remarks
 * These custom exceptions are used to provide specific error handling and response
 * messages for various application-specific error scenarios. Each exception class
 * is tailored to a particular type of error, ensuring consistency and clarity in
 * error reporting and handling across the application.
 *
 * @see {@link https://docs.nestjs.com/exception-filters#built-in-http-exceptions | NestJS Built-in HTTP Exceptions}
 */

import { createException } from '../helpers/exception.factory';

// Enum defining global exception codes for consistency
enum GlobalExceptionCode {
  BadRequest = 'P4001',
  Unauthorized = 'P4011',
  NotFound = 'P4041',
  Forbidden = 'P4031',
  NotAcceptable = 'P4061',
  RequestTimeout = 'P4081',
  Conflict = 'P4091',
  Gone = 'P4101',
  HttpVersionNotSupported = 'P5051',
  PayloadTooLarge = 'P4131',
  UnsupportedMediaType = 'P4151',
  UnprocessableEntity = 'P4221',
  InternalServerError = 'P5001',
  NotImplemented = 'P5011',
  ImATeapot = 'P4181',
  MethodNotAllowed = 'P4051',
  BadGateway = 'P5021',
  ServiceUnavailable = 'P5031',
  GatewayTimeout = 'P5041',
  PreconditionFailed = 'P4121',
  TooManyRequests = 'P4291',
}

// Custom exception classes
export class BadRequestError extends createException(
  400,
  'The request could not be understood by the server.',
  GlobalExceptionCode.BadRequest
) {
  constructor(customMessage?: string) {
    super(customMessage);
  }
}

export class UnauthorizedError extends createException(
  401,
  'You are not authorized to access this resource.',
  GlobalExceptionCode.Unauthorized
) {
  constructor(customMessage?: string) {
    super(customMessage);
  }
}

export class NotFoundError extends createException(
  404,
  'The requested resource could not be found.',
  GlobalExceptionCode.NotFound
) {
  constructor(customMessage?: string) {
    super(customMessage);
  }
}

export class ForbiddenError extends createException(
  403,
  'Access to this resource is forbidden.',
  GlobalExceptionCode.Forbidden
) {
  constructor(customMessage?: string) {
    super(customMessage);
  }
}

export class NotAcceptableError extends createException(
  406,
  'The server cannot generate a response that meets the criteria specified in the request.',
  GlobalExceptionCode.NotAcceptable
) {
  constructor(customMessage?: string) {
    super(customMessage);
  }
}

export class RequestTimeoutError extends createException(
  408,
  'The server timed out waiting for the request.',
  GlobalExceptionCode.RequestTimeout
) {
  constructor(customMessage?: string) {
    super(customMessage);
  }
}

export class ConflictError extends createException(
  409,
  'Conflict occurred while processing the request.',
  GlobalExceptionCode.Conflict
) {
  constructor(customMessage?: string) {
    super(customMessage);
  }
}

export class GoneError extends createException(
  410,
  'The requested resource is no longer available.',
  GlobalExceptionCode.Gone
) {
  constructor(customMessage?: string) {
    super(customMessage);
  }
}

export class HttpVersionNotSupportedError extends createException(
  505,
  'The HTTP version used in the request is not supported by the server.',
  GlobalExceptionCode.HttpVersionNotSupported
) {
  constructor(customMessage?: string) {
    super(customMessage);
  }
}

export class PayloadTooLargeError extends createException(
  413,
  'The request is larger than the server is willing or able to process.',
  GlobalExceptionCode.PayloadTooLarge
) {
  constructor(customMessage?: string) {
    super(customMessage);
  }
}

export class UnsupportedMediaTypeError extends createException(
  415,
  'The media type of the request entity is not supported by the server.',
  GlobalExceptionCode.UnsupportedMediaType
) {
  constructor(customMessage?: string) {
    super(customMessage);
  }
}

export class UnprocessableEntityError extends createException(
  422,
  'The server understands the content type of the request entity, but was unable to process the contained instructions.',
  GlobalExceptionCode.UnprocessableEntity
) {
  constructor(customMessage?: string) {
    super(customMessage);
  }
}

export class InternalServerError extends createException(
  500,
  'An unexpected error occurred while processing the request.',
  GlobalExceptionCode.InternalServerError
) {
  constructor(customMessage?: string) {
    super(customMessage);
  }
}

export class NotImplementedError extends createException(
  501,
  'The server does not support the functionality required to fulfill the request.',
  GlobalExceptionCode.NotImplemented
) {
  constructor(customMessage?: string) {
    super(customMessage);
  }
}

export class ImATeapotError extends createException(418, "I'm a teapot (RFC 2324).", GlobalExceptionCode.ImATeapot) {
  constructor(customMessage?: string) {
    super(customMessage);
  }
}

export class MethodNotAllowedError extends createException(
  405,
  'The method specified in the request is not allowed for the resource identified by the request URI.',
  GlobalExceptionCode.MethodNotAllowed
) {
  constructor(customMessage?: string) {
    super(customMessage);
  }
}

export class BadGatewayError extends createException(
  502,
  'The server received an invalid response from an upstream server while processing the request.',
  GlobalExceptionCode.BadGateway
) {
  constructor(customMessage?: string) {
    super(customMessage);
  }
}

export class ServiceUnavailableError extends createException(
  503,
  'The server is currently unable to handle the request due to a temporary overload or maintenance of the server.',
  GlobalExceptionCode.ServiceUnavailable
) {
  constructor(customMessage?: string) {
    super(customMessage);
  }
}

export class GatewayTimeoutError extends createException(
  504,
  'The server did not receive a timely response from an upstream server it needed to access in order to complete the request.',
  GlobalExceptionCode.GatewayTimeout
) {
  constructor(customMessage?: string) {
    super(customMessage);
  }
}

export class PreconditionFailedError extends createException(
  412,
  'The server does not meet one of the preconditions that the requester put on the request.',
  GlobalExceptionCode.PreconditionFailed
) {
  constructor(customMessage?: string) {
    super(customMessage);
  }
}

export class TooManyRequestsError extends createException(
  429,
  'You have sent too many requests in a short period of time. Please wait a while before trying again.',
  GlobalExceptionCode.TooManyRequests
) {
  constructor(customMessage?: string) {
    super(customMessage);
  }
}
