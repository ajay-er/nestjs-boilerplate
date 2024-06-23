import type { ExceptionPayload } from './exception.payload';

/**
 * App Response for both exception and success response
 *
 */
export type AppResponse = {
  success: boolean;
  data: any;
  error: ExceptionPayload;
};
