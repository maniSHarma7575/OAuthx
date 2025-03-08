import { oauthClient } from "./oauthClient";
import { PKCE } from "@manisharma7575/oauthx";
import { setCookie, deleteCookie, getCodeVerifier } from "./cookies";

export async function initiateLoginFlow() {
  try {
    const verifier = await PKCE.generateRandomCodeVerifier();
    await setCookie("code_verifier", verifier);

    const authUrl = oauthClient.getAuthorizeURI({
      response_type: "code",
      scope: ["openid", "profile", "email", "offline_access"],
      codeVerifier: verifier,
    });

    return authUrl;
  } catch (error) {
    console.error("Login initiation failed:", error);
    throw new Error("Error initiating authentication process. Please try again.}");
  }
}

export async function handleAuthCallback(uri) {
  try {
    const codeVerifier = await getCodeVerifier();

    if (!codeVerifier) {
      throw new Error("Missing required parameters");
    }

    const oauth2Token = await oauthClient.handleCallback({
      grant_type: "authorization_code",
      uri,
      code_verifier: codeVerifier,
    });

    if(oauth2Token.refresh_token){
      await setCookie("refresh_token", oauth2Token.refresh_token, {
        maxAge: 60 * 60 * 24 * 30,
      });
    }
    await setCookie("access_token", oauth2Token.access_token, {
      maxAge: oauth2Token.expires_in,
    });
    const currentTime = Math.floor(Date.now() / 1000);
    await setCookie("access_token_expires_at", String(currentTime + oauth2Token.expires_in), {
      maxAge: oauth2Token.expires_in,
    });
    deleteCookie("code_verifier");

    return "/";
  } catch (error) {
    console.error("Callback error:", error);
    throw new Error("Failed to handle callback. Please try again.");
  }
}