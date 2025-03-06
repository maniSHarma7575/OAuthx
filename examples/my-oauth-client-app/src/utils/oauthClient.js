import { OAuthXClient } from "oauthx";

const server = "https://dev-hyrlm5qytsf4favx.us.auth0.com";

export const oauthClient = new OAuthXClient({
  server: server,
  client_id: "IzzJCDF5bfktrcfOeatVfDRn4ochjwiW",
  redirect_uri: "http://localhost:3000",
  tokenEndpoint: "/oauth/token",
});

export const AUTH_SERVER = server;