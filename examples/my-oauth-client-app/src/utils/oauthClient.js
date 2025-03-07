import { OAuthXClient } from "oauthx";

export const oauthClient = new OAuthXClient({
  server: import.meta.env.VITE_AUTH_SERVER,
  client_id: import.meta.env.VITE_CLIENT_ID,
  client_secret: import.meta.env.VITE_CLIENT_SECRET,
  redirect_uri: import.meta.env.VITE_REDIRECT_URI,
  token_endpoint: import.meta.env.VITE_TOKEN_ENDPOINT,
});

export const AUTH_SERVER = import.meta.env.VITE_AUTH_SERVER;