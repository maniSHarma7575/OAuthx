import { AuthorizationCodeClient } from "./authorization-code-grant/authorization-code-client";

export class OAuthXClient {
  constructor(configurations) {
    this.configurations = configurations;
  }

  async getAuthorizeURI(params) {
    return new AuthorizationCodeClient(this.configurations).authorizeURI(params);
  }

  async handleCallback(params) {
    return new AuthorizationCodeClient(this.configurations).accessToken(params.uri, {
      grant_type: params.grant_type,
      codeVerifier: params.code_verifier,
      state: params.state
    });
  }

  async refreshToken(refreshToken, params) {
    return new AuthorizationCodeClient(this.configurations).refreshToken(refreshToken, params);
  }
}