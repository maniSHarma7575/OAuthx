import { OAuthXClient } from "@manisharma7575/oauthx";

export const oauthClient = new OAuthXClient({
  server: import.meta.env.VITE_AUTH_SERVER,
  client_id: import.meta.env.VITE_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_REDIRECT_URI,
  tokenEndpoint: import.meta.env.VITE_TOKEN_ENDPOINT,
});

export const AUTH_SERVER = import.meta.env.VITE_AUTH_SERVER;