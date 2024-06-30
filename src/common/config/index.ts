import 'dotenv/config';

import { bool, cleanEnv, host, num, port, str, url } from 'envalid';

export const env = cleanEnv(process.env, {
  APP_NAME: str({
    default: 'MyApp',
    desc: 'The name of the application',
  }),

  FRONTEND_DOMAIN: str({
    default: 'http://localhost:3001',
    desc: 'The base URL of the frontend application',
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

  AUTH_JWT_SECRET: str({
    desc: 'JWT secret key for authentication',
    default: 'secret',
  }),

  AUTH_JWT_TOKEN_EXPIRES_IN: str({
    desc: 'JWT token expiration time for authentication',
    default: '15m',
  }),

  AUTH_REFRESH_SECRET: str({
    desc: 'Refresh token secret key for authentication',
    default: 'secret_for_refresh',
  }),

  AUTH_REFRESH_TOKEN_EXPIRES_IN: str({
    desc: 'Refresh token expiration time for authentication',
    default: '365d',
  }),

  AUTH_FORGOT_SECRET: str({
    desc: 'Secret key for forgot password functionality',
    default: 'secret_for_forgot',
  }),

  AUTH_FORGOT_TOKEN_EXPIRES_IN: str({
    desc: 'Token expiration time for forgot password functionality',
    default: '30m',
  }),

  AUTH_CONFIRM_EMAIL_SECRET: str({
    desc: 'Secret key for email confirmation',
    default: 'secret_for_confirm_email',
  }),

  AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN: str({
    desc: 'Token expiration time for email confirmation',
    default: '1d',
  }),

  GOOGLE_CLIENT_ID: str({
    desc: 'Client ID for Google OAuth',
    default: '',
  }),

  GOOGLE_CLIENT_SECRET: str({
    desc: 'Client secret for Google OAuth',
    default: '',
  }),

  GOOGLE_CALLBACK_URL: url({
    desc: 'callback url for Google OAuth',
  }),

  MAIL_HOST: host({
    desc: 'The host address for the mail server',
  }),

  MAIL_PORT: port({
    desc: 'The port number for the mail server',
  }),

  MAIL_SECURE: bool({
    default: false,
    desc: 'Whether to use a secure connection for the mail server',
  }),

  MAIL_USER: str({
    desc: 'The user for the mail server authentication',
  }),

  MAIL_PASSWORD: str({
    desc: 'The password for the mail server authentication',
  }),

  MAIL_DEFAULT_NAME: str({
    desc: 'The default name for the email sender',
  }),

  MAIL_DEFAULT_EMAIL: str({
    desc: 'The default email address for the email sender',
  }),
});
