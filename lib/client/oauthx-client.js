import { AuthorizationCodeClient } from "./authorization-code-grant/authorization-code-client";

export class OAuthXClient {
  constructor(configurations) {
    this.configurations = configurations;
  }

  async getAuthorizeURI(params) {
    new AuthorizationCodeClient(this.configurations).authorizeURI(params);
  }

  async handleCallback(params) {
    new AuthorizationCodeClient(this.configurations).accessToken(params.uri, { 
      codeVerifier: params.code_verifier,
      state: params.state
    });
  }

  async refreshToken(refreshToken, params) {
    return new AuthorizationCodeClient(this.configurations).refreshToken(refreshToken, params);
  }
}