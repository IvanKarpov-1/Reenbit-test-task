declare interface Env {
  readonly NODE_ENV: string;
  readonly NG_APP_API_SERVER_URL: string;
  readonly NG_APP_AUTH0_DOMAIN: string;
  readonly NG_APP_AUTH0_CLIENT_ID: string;
  readonly NG_APP_AUTH0_AUDIENCE: string;
  readonly NG_APP_AUTH0_CALLBACK_URI: string;
}

declare interface ImportMeta {
  readonly env: Env;
}
