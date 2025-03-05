export class OAuthXError extends Error {
  constructor(message, oauth2Code) {
    super(message);
    this.oauth2Code = oauth2Code;
  }
}

export class OAuthXHttpError extends OAuthXError {
  constructor(message, oauth2Code, response, parsedBody) {
    super(message, oauth2Code);
    this.httpCode = response.status;
    this.response = response;
    this.parsedBody = parsedBody;
  }
}