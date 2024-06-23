import type { ExceptionPayload } from '@/common/types'; // Importing type definition for ExceptionPayload

import { RootException } from './exception.abstract'; // Importing RootException class

/**
 * Creates a custom exception class constructor function.
 * @param statusCode HTTP status code associated with the exception.
 * @param message Error message describing the exception.
 * @param code Optional error code associated with the exception (default is 'Unknown').
 * @returns A dynamically generated exception class constructor.
 */
export const createException = (statusCode: number, message: string, code: string = 'Unknown') => {
  // Define payload structure for the exception
  const payload: ExceptionPayload = {
    code,
    message,
  };

  // Return a dynamically generated class that extends RootException
  return class extends RootException {
    /**
     * Constructor for the dynamically generated exception class.
     * Calls the parent RootException constructor with provided payload, status code, and code.
     */
    constructor() {
      super(payload, statusCode, code);
    }
  };
};
