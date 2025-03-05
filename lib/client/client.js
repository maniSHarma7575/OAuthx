import { ENDPOINTS, HEADERS } from "../constant/constant.js";
import { OAuthXRequest } from "../request/oauthx-request.js";
export class Client {
  constructor(configurations) {
    this.configurations = configurations;
    this.request = new OAuthXRequest(configurations);
  }

  async getTokenRequest(body) {
    const headers = {
      [HEADERS.CONTENT_TYPE]: HEADERS.FORM_URL_ENCODED,
    };

    return this.request.post(ENDPOINTS.TOKEN, body, headers);
  }
}