import { cookies } from "next/headers";
import { oauthClient } from "./oauthClient";

export async function getAccessToken() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;
  const expiresAt = parseInt(cookieStore.get("access_token_expires_at")?.value || "0", 10);
  const currentTime = Math.floor(Date.now() / 1000);

  if (accessToken && expiresAt > currentTime) {
    return accessToken;
  }

  if (refreshToken) {
    try {

      const newTokenResponse = await oauthClient.refreshToken(refreshToken);
      const newAccessToken = newTokenResponse.access_token;

      if (!newAccessToken) throw new Error("Failed to refresh token");

      await setCookie("access_token", newAccessToken, {
        maxAge: newTokenResponse.expires_in,
      });

      await setCookie("access_token_expires_at", String(currentTime + newTokenResponse.expires_in), {
        maxAge: newTokenResponse.expires_in,
      });

      if (newTokenResponse.refresh_token) {
        await setCookie("refresh_token", newTokenResponse.refresh_token, {
          maxAge: 60 * 60 * 24 * 30,
        });
      }

      return newAccessToken;
    } catch (error) {
      console.error("Failed to refresh access token:", error);
      throw new Error("Unauthorized");
    }
  }

  throw new Error("Unauthorized");
}

export async function getCodeVerifier() {
  const cookieStore = await cookies();
  return cookieStore.get("code_verifier")?.value;
}

export async function setCookie(name, value, options = {}) {
  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: isEnvProduction(),
    sameSite: "lax",
    path: "/",
    ...(options.maxAge ? { maxAge: options.maxAge } : {}),
  };

  cookieStore.set(name, value, cookieOptions);
}

function isEnvProduction() {
  return process.env.NODE_ENV === "production";
}

export async function deleteCookie(name) {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}

export function flushCookieHeaders() {
  const headers = new Headers();
  
  headers.append("Set-Cookie", "access_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0");
  headers.append("Set-Cookie", "refresh_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0");
  headers.append("Set-Cookie", "code_verifier=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0");
  return headers;
}