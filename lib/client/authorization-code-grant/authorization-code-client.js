
import { RESPONSE_TYPES, GRANT_TYPES, ENDPOINTS } from "../../constant/constant.js";
import PKCE from "./pkce.js";
import AuthorizationCodeValidator from "./authorization-callback-validator.js";
import { Client } from "../client.js";

export class AuthorizationCodeClient extends Client {
  async authorizeURI(params) {
    if(!(params.response_type === RESPONSE_TYPES.CODE || params.response_type === RESPONSE_TYPES.TOKEN)) {
      throw new Error("Please check the response_type");
    }

    const query = new URLSearchParams({
      response_type: RESPONSE_TYPES.CODE,
      client_id: this.configurations.client_id,
      redirect_uri: this.configurations.redirect_uri,
    });

    if (params.scope) {
      query.set("scope", params.scope.join(" "));
    }

    if (params.codeVerifier) {
      const codeChallenge = await PKCE.generateCodeChallenge(params.codeVerifier);
      query.set("code_challenge_method", codeChallenge[0]);
      query.set("code_challenge", codeChallenge[1]);
    }

    if (params.state) {
      query.set("state", params.state);
    }

    return `${this.request.getEndPoint(ENDPOINTS.AUTHORIZATION)}?${query.toString()}`;
  }

  async accessToken(url, params) {
    if (!url) {
      throw new Error("URL is required");
    }

    if(params.grant_type !== GRANT_TYPES.AUTHORIZATION_CODE) {
      throw new Error("Please check the grant_type");
    }

    const { code } = AuthorizationCodeValidator.validateResponse(url, params.state);
    const body = {
      grant_type: GRANT_TYPES.AUTHORIZATION_CODE,
      code,
      redirect_uri: this.configurations.redirect_uri,
      code_verifier: params.codeVerifier,
    };

    return this.getTokenRequest(body);
  }

  async refreshToken(refreshToken, params) {
    if (!refreshToken) {
      throw new Error("This token didn't have a refreshToken. It's not possible to refresh this");
    }

    const body = {
      grant_type: GRANT_TYPES.REFRESH_TOKEN,
      refresh_token: refreshToken,
    };

    if (!this.configurations.client_secret) {
      body.client_id = this.configurations.client_id;
    }

    if (params?.scope) {
      body.scope = params.scope.join(" ");
    }

    const newToken = await this.getTokenRequest(body);

    if (!newToken.refresh_token) {
      newToken.refresh_token = refreshToken;
    }

    return newToken;
  }
}