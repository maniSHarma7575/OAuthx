import { OAuthXError } from "../../error";

class AuthorizationCodeValidator {
  static validateResponse(url, params = {}) {
    const parsedUrl = new URL(url);
    let queryParams = parsedUrl.searchParams;

    if (!queryParams.has("code") && !queryParams.has("error") && parsedUrl.hash.length > 0) {
      queryParams = new URLSearchParams(parsedUrl.hash.slice(1));
    }

    if (queryParams.has("error")) {
      throw new OAuthXError(
        queryParams.get("error_description") ?? "OAuth2 error",
        queryParams.get("error")
      );
    }

    if (!queryParams.has("code")) {
      throw new Error(`The URL did not contain a 'code' parameter: ${url}`);
    }

    if (params.state && params.state !== queryParams.get("state")) {
      throw new Error(
        `The "state" parameter in the URL did not match the expected value of ${params.state}`
      );
    }

    return {
      code: queryParams.get("code"),
      scope: queryParams.has("scope") ? queryParams.get("scope").split(" ") : undefined,
    };
  }
}

export default AuthorizationCodeValidator;
