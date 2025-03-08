import { cookies } from "next/headers";
import { oauthClient } from "./oauthClient";
import { PKCE } from "@manisharma7575/oauthx";

export async function getAccessToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) throw new Error("Unauthorized");
  return token;
}

export async function initiateLoginFlow() {
  try {
    const verifier = await PKCE.generateRandomCodeVerifier();
    setCookie("code_verifier", verifier);

    const authUrl = oauthClient.getAuthorizeURI({
      response_type: "code",
      scope: ["openid", "profile", "email", "offline_access"],
      code_verifier: verifier,
      state: "random_state"
    });

    return authUrl;
  } catch (error) {
    console.error("Login initiation failed:", error);
    throw new Error("Error initiating authentication process. Please try again.}");
  }
}

async function setCookie(name, value) {
  const cookieStore = await cookies();
  cookieStore.set(name, value, {
    httpOnly: true,
    secure: isEnvProduction(),
    sameSite: "lax",
    path: "/",
  });
}

function isEnvProduction() {
  return process.env.NODE_ENV === "production";
}