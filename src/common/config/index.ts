import 'dotenv/config';

import { cleanEnv, host, num, port, str } from 'envalid';

export const env = cleanEnv(process.env, {
  APP_NAME: str({
    default: 'MyApp',
    desc: 'The name of the application',
  }),

  NODE_ENV: str({
    choices: ['development', 'test', 'production', 'staging'],
    desc: 'The application environment',
  }),

  HOST: host({
    desc: 'The host address for the server',
  }),

  PORT: port({
    desc: 'The port number for the server',
  }),

  CORS_ORIGIN: str({
    desc: 'The allowed CORS origin(s) for the application, can be a single URL or an array of URLs',
  }),

  THROTTLE_TTL: num({
    default: 60000,
    desc: 'The time-to-live (TTL) in milliseconds for rate limiting. This defines the window within which API requests will be counted for throttling purposes.',
  }),

  THROTTLE_LIMIT: num({
    default: 20,
    desc: 'The maximum number of API requests allowed within the THROTTLE_TTL window. If a client exceeds this limit, their requests will be throttled.',
  }),
});
