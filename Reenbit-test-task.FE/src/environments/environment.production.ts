export const environment = {
  // production: true,
  apiBaseUrl: import.meta.env.NG_APP_API_SERVER_URL,
  auth0: {
    domain: import.meta.env.NG_APP_AUTH0_DOMAIN,
    clientId: import.meta.env.NG_APP_AUTH0_CLIENT_ID,
    audience: import.meta.env.NG_APP_AUTH0_AUDIENCE,
    redirect_uri: import.meta.env.NG_APP_AUTH0_CALLBACK_URI,
  },
};
