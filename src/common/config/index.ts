import 'dotenv/config';

import { cleanEnv, host, port, str } from 'envalid';

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
});
