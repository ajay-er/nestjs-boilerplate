import 'dotenv/config';

import { bool, cleanEnv, host, num, port, str } from 'envalid';

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

  DATABASE_HOST: str({
    default: 'localhost',
    desc: 'The host address of the database server.',
  }),

  DATABASE_PORT: port({
    default: 5432,
    desc: 'The port number on which the database server is listening.',
  }),

  DATABASE_USERNAME: str({
    desc: 'The username used to authenticate with the database server.',
  }),

  DATABASE_PASSWORD: str({
    desc: 'The password used to authenticate with the database server.',
  }),

  DATABASE_NAME: str({
    desc: 'The name of the database to connect to.',
  }),

  DATABASE_MAX_CONNECTIONS: num({
    default: 100,
    desc: 'The maximum number of connections allowed in the database connection pool.',
  }),

  DATABASE_SSL_ENABLED: bool({
    default: true,
    desc: 'Whether SSL/TLS encryption is enabled for the database connection.',
  }),

  DATABASE_REJECT_UNAUTHORIZED: bool({
    default: false,
    desc: 'Whether to reject connections with SSL certificate validation issues.',
  }),

  DATABASE_CA: str({
    desc: 'Optional CA certificate for database SSL/TLS connection (base64 encoded).',
    default: '',
  }),

  DATABASE_KEY: str({
    desc: 'Optional client key for database SSL/TLS connection (base64 encoded).',
    default: '',
  }),

  DATABASE_CERT: str({
    desc: 'Optional client certificate for database SSL/TLS connection (base64 encoded).',
    default: '',
  }),
});
