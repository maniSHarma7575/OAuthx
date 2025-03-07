# @manisharma7575/oauthx

OAuthX is a lightweight OAuth 2.0 client library that simplifies authentication using the Authorization Code flow with PKCE. It provides easy-to-use methods for generating authorization URLs, handling authentication callbacks, and refreshing access tokens.

**OAuth Flow Supported:**
- Authorization Code
- PKCE
- Implicit

## Scope of Improvement
- Example for the Server Side Rendering
- Integrating Client Credentials Flow
- Jest test

## Installation

Install the package via npm:

```sh
npm install @manisharma7575/oauthx
```

## Demo Application

[https://oauthx.netlify.app/](https://oauthx.netlify.app/)

```sh
cd examples/my-oauth-client-app
```

Make sure the credentails are set in the `.env` file

```shell
npm install
npm run dev
```

## Usage

Initialize OAuthXClient

To set up OAuthXClient, provide the necessary OAuth 2.0 configurations:

```js
import { OAuthXClient } from "@manisharma7575/oauthx";

const oauthClient = new OAuthXClient({
  server: "AUTH_SERVER",
  client_id: "CLIENT_ID",
  client_secret: "CLIENT_SECRET",
  redirect_uri: "REDIRECT_URI",
  token_endpoint: "TOKEN_ENDPOINT", // Default Value: "/token"
  authorization_endpoint: "AUTHORIZE_ENDPOINT" // Default Value: "/authorize"
});
```

**Public Methods**

`getAuthorizeURI(params)`

Generates the authorization URL for initiating the OAuth flow.

Params:
- response_type (string, required) - The response type (e.g., "code", "token").
- scope (array, required) - The list of scopes.
- codeVerifier (string, optional) - PKCE code verifier.
- state (string, optional) - A custom state value.

Example:

```js
const authUrl = await oauthClient.getAuthorizeURI({
  response_type: "code",
  scope: ["openid", "profile", "email", "offline_access"],
  codeVerifier: "random_code_verifier",
  state: "custom_state",
});

window.location.href = authUrl;
```
-----

`handleCallback(params)`

Handles the OAuth callback and exchanges the authorization code for an access token.

Params:
- grant_type (string, required) - The type of grant (e.g., "authorization_code").
- uri (string, required) - The callback URI containing the authorization code.
- code_verifier (string, required) - The PKCE code verifier used in the request.
- state (string, optional) - The state value from the authorization request.

Example:

```js
const tokenResponse = await oauthClient.handleCallback({
  grant_type: "authorization_code",
  uri: window.location.href,
  code_verifier: localStorage.getItem("code_verifier") || "",
  state: "custom_state",
});

console.log(tokenResponse.access_token);
```

-----

`refreshToken(refreshToken, params)`

Refreshes the access token using a refresh token.

Params:
- refreshToken (string, required) - The refresh token.
- params (object, optional) - Additional parameters for the refresh request.

Example:

```js
const newTokenResponse = await oauthClient.refreshToken("your_refresh_token");
console.log(newTokenResponse.access_token);
```

-----

**PKCE Utility**

`generateRandomCodeVerifier()`

Generates a secure random code verifier for PKCE.

Example:

```js
import { PKCE } from "@manisharma7575/oauthx";

const verifier = await PKCE.generateRandomCodeVerifier();
console.log(verifier);
```
-----

## Example Workflow
- Generate an authorization URL using getAuthorizeURI and redirect the user to the OAuth provider.
- Handle the authentication callback using handleCallback to exchange the authorization code for an access token.
- Store the access and refresh tokens securely (e.g., local storage or secure storage).
- Use the access token to make authenticated API requests.
- Refresh the access token using refreshToken when it expires.

----

## References
- [https://github.com/badgateway/oauth2-client/tree/main](https://github.com/badgateway/oauth2-client/tree/main)
- [https://oauth.net/2/](https://oauth.net/2/)
- [https://www.oauth.com/playground/](https://www.oauth.com/playground/)