import { oauthClient, AUTH_SERVER } from "../utils/oauthClient";
import { PKCE } from "@manisharma7575/oauthx";

const REFRESH_TOKEN_KEY = "refresh_token";
const ACCESS_TOKEN_KEY = "access_token";
const EXPIRES_AT_KEY = "expires_at";

export const login = async () => {
  const verifier = await PKCE.generateRandomCodeVerifier();
  localStorage.setItem("code_verifier", verifier);

  const authUrl = await oauthClient.getAuthorizeURI({
    response_type: "code",
    scope: ["openid", "profile", "email", "offline_access"],
    codeVerifier: verifier,
    state: "custom_state",
  });

  window.location.href = authUrl;
};

export const handleAuthCallback = async () => {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("code")) return null;

  try {
    const state = params.get("state");

    const tokenResponse = await oauthClient.handleCallback({
      grant_type: "authorization_code",
      uri: window.location.href,
      code_verifier: localStorage.getItem("code_verifier") || "",
      state,
    });

    localStorage.setItem(REFRESH_TOKEN_KEY, tokenResponse.refresh_token);
    localStorage.setItem(ACCESS_TOKEN_KEY, tokenResponse.access_token);
    localStorage.setItem(EXPIRES_AT_KEY, Date.now() + tokenResponse.expires_in * 1000); // Store expiry time

    return tokenResponse;
  } catch (error) {
    console.error("Error handling auth callback:", error);
    return null;
  }
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) return null;

  try {
    const newTokenResponse = await oauthClient.refreshToken(refreshToken);

    localStorage.setItem(REFRESH_TOKEN_KEY, newTokenResponse.refresh_token);
    localStorage.setItem(ACCESS_TOKEN_KEY, newTokenResponse.access_token);
    localStorage.setItem(EXPIRES_AT_KEY, Date.now() + newTokenResponse.expires_in * 1000);

    return newTokenResponse;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

export const getStoredAccessToken = () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const expiresAt = localStorage.getItem(EXPIRES_AT_KEY);

  if (accessToken && expiresAt && Date.now() < expiresAt) {
    return accessToken; // Token is still valid
  }
  
  return null;
};

export const fetchUserData = async (accessToken) => {
  try {
    const response = await fetch(`${AUTH_SERVER}/userinfo`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) throw new Error("Failed to fetch user data");

    return await response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
  localStorage.removeItem("code_verifier");

  window.location.href = "/"; // Redirect to home
};
