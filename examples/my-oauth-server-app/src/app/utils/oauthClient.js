import { OAuthXClient } from "@manisharma7575/oauthx";

export const oauthClient = new OAuthXClient({
  server: process.env.NEXT_PUBLIC_AUTH_SERVER,
  client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
  client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
  redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
  token_endpoint: process.env.NEXT_PUBLIC_TOKEN_ENDPOINT,
});

export const AUTH_SERVER = process.env.NEXT_PUBLIC_AUTH_SERVER;