export type DatabaseOptions = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  maxConnections?: number;
  sslEnabled?: boolean;
  rejectUnauthorized?: boolean;
  ca?: string;
  key?: string;
  cert?: string;
};
