import { OAuthXHttpError } from "../error";
import { GRANT_TYPES, ENDPOINTS, HEADERS } from "../constant/constant.js";

export class OAuthXRequest {
  constructor(clientSettings) {
    this.clientSettings = clientSettings;
  }

  async post(endpoint, params) {
    const url = this.tokenURL();
    const body = this.createRequestBody(endpoint, params);

    const headers = {
      [HEADERS.CONTENT_TYPE]: HEADERS.FORM_URL_ENCODED,
    };

    if (this.clientSettings.client_secret) {
      const credentials = `${this.clientSettings.client_id}:${this.clientSettings.client_secret}`;
      const encodedCredentials =
        typeof btoa !== "undefined"
          ? btoa(credentials) // Browser
          : Buffer.from(credentials).toString("base64"); // Node.js
      headers.Authorization = `Basic ${encodedCredentials}`;
    }

    const resp = await fetch(url, {
      method: "POST",
      headers,
      body: new URLSearchParams(body),
    });

    let responseBody;
    if (
      resp.status !== 204 &&
      resp.headers.has("Content-Type") &&
      resp.headers.get("Content-Type")?.match(/^application\/(.*\+)?json/)
    ) {
      responseBody = await resp.json();
    }
    
    if (resp.ok) {
      return responseBody;
    }

    let errorMessage;
    let oauth2Code;

    if (responseBody?.error) {
      errorMessage = "OAuth2 error " + responseBody.error + ".";
      if (responseBody.error_description) {
        errorMessage += " " + responseBody.error_description;
      }
      oauth2Code = responseBody.error;

    } else {
      errorMessage = "HTTP Error " + resp.status + " " + resp.statusText;
      if (resp.status === 401 && this.settings.client_secret) {
        errorMessage += ". It's likely that the clientId and/or client_secret was incorrect";
      }
      oauth2Code = null;
    }
    throw new OAuthXHttpError(errorMessage, oauth2Code, resp, responseBody);
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
        code_verifier: params.code_verifier,
      });

      if (!this.clientSettings.client_secret) {
        body.client_id = this.clientSettings.client_id;
      }
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

  getDefaultUrl(endpoint) {
    if (this.clientSettings[endpoint]) {
      return this.resolvePath(this.clientSettings[endpoint]);
    }
    return null;
  }

  authorizationUrl() {
    if (this.getDefaultUrl(ENDPOINTS.AUTHORIZATION)) {
      return this.getDefaultUrl(ENDPOINTS.AUTHORIZATION);
    }

    return this.resolvePath("/authorize");
  }

  tokenURL() {
    if (this.getDefaultUrl(ENDPOINTS.TOKEN)) {
      return this.getDefaultUrl(ENDPOINTS.TOKEN);
    }

    return this.resolvePath("/token");
  }

  resolvePath(path) {
    return new URL(path, this.clientSettings.server).toString();
  }
}
