import { OAuthXHttpError } from "../error";
import { GRANT_TYPES, ENDPOINTS, HEADERS } from "../constant/constant.js";

export class OAuthXRequest {
  constructor(clientSettings) {
    this.clientSettings = clientSettings;
  }

  async post(endpoint, params) {
    const url = this.getEndpoint(endpoint);
    const body = this.createRequestBody(endpoint, params);

    const headers = {
      [HEADERS.CONTENT_TYPE]: HEADERS.FORM_URL_ENCODED,
    };

    if (this.clientSettings.clientSecret) {
      const credentials = `${this.clientSettings.clientId}:${this.clientSettings.clientSecret}`;
      const encodedCredentials =
        typeof btoa !== "undefined"
          ? btoa(credentials) // Browser
          : Buffer.from(credentials).toString("base64"); // Node.js
      headers.Authorization = `Basic ${encodedCredentials}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: new URLSearchParams(body),
    });

    if (!response.ok) {
      throw new OAuthXHttpError(response);
    }

    return response.json();
  }

  createRequestBody(endpoint, params) {
    switch (endpoint) {
      case ENDPOINTS.TOKEN:
        if (!params.grant_type) {
          throw new Error("grant_type is required");
        }
        return this.buildTokenRequestBody(params);
      default:
        throw new Error(`Unknown endpoint: ${endpoint}`);
    }
  }

  buildTokenRequestBody(params) {
    const body = { grant_type: params.grant_type };

    if (params.grant_type === GRANT_TYPES.AUTHORIZATION_CODE) {
      if (!params.code) {
        throw new Error("Authorization code is required");
      }
      Object.assign(body, {
        code: params.code,
        redirect_uri: this.clientSettings.redirect_uri,
        code_verifier: params.codeVerifier,
      });
    }

    if (params.grant_type === GRANT_TYPES.REFRESH_TOKEN) {
      if (!params.refresh_token) {
        throw new Error("Refresh token is required");
      }
      Object.assign(body, { refresh_token: params.refresh_token });

      if (!this.clientSettings.client_secret) {
        body.client_id = this.clientSettings.client_id;
      }

      if (params.scope) {
        body.scope = params.scope.join(" ");
      }
    }

    return body;
  }

  getEndpoint(endpoint) {
    if (this.clientSettings[endpoint]) {
      return this.resolvePath(this.clientSettings[endpoint]);
    }

    switch (endpoint) {
      case ENDPOINTS.AUTHORIZATION:
        return this.resolvePath("/authorize");
      case ENDPOINTS.TOKEN:
        return this.resolvePath("/token");
      default:
        throw new Error(`Unknown endpoint: ${endpoint}`);
    }
  }

  resolvePath(path) {
    return new URL(path, this.clientSettings.server).toString();
  }
}
