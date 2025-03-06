import React, { useEffect, useState } from "react";
import { OAuthXClient, PKCE } from "oauthx";

const server = "https://dev-hyrlm5qytsf4favx.us.auth0.com"
const oauthClient = new OAuthXClient({
  server: server,
  client_id: "IzzJCDF5bfktrcfOeatVfDRn4ochjwiW",
  redirect_uri: "http://localhost:3000",
  tokenEndpoint: "/oauth/token",
});

const App = () => {
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userData, setUserData] = useState(null); // Store user info

  const login = async () => {
    const verifier = await PKCE.generateRandomCodeVerifier();
    localStorage.setItem("code_verifier", verifier);

    console.log("Printing code verifier:", verifier);
    const authUrl = await oauthClient.getAuthorizeURI({ 
      response_type: "code",
      scope: ["openid", "profile", "email", "offline_access"],
      codeVerifier: verifier,
      state: "mamaamaammam"
    });

    window.location.href = authUrl;
  };

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      if (params.has("code")) {
        const code = params.get("code");
        console.log("Authorization Code:", code);
        const state = params.get("state");

        console.log("*****************************************************");
        const tokenResponse = await oauthClient.handleCallback({
          grant_type: "authorization_code",
          uri: window.location.href,
          code_verifier: localStorage.getItem("code_verifier") || "",
          state: state
        });

        console.log("########################################################");
        console.log("Token Response:", tokenResponse);

        setToken(tokenResponse.access_token);
        setRefreshToken(tokenResponse.refresh_token);

        // Fetch user data after obtaining token
        fetchUserData(tokenResponse.access_token);
      }
    };
    handleCallback();
  }, []);

  const refreshAccessToken = async () => {
    if (refreshToken) {
      const newTokenResponse = await oauthClient.refreshToken(refreshToken);
      setToken(newTokenResponse.access_token);
      setRefreshToken(newTokenResponse.refresh_token);
      fetchUserData(newTokenResponse.access_token);
    }
  };

  const fetchUserData = async (accessToken) => {
    try {
      const response = await fetch(`${server}/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Response:", response);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      console.log("User Info:", data);
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">OAuthX Login</h1>
      {token ? (
        <div className="mt-4">
          <p className="mb-2"><strong>Access Token:</strong> {token}</p>
          {userData && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <h2 className="text-lg font-semibold">User Info</h2>
              <pre className="text-sm">{JSON.stringify(userData, null, 2)}</pre>
            </div>
          )}
          <button onClick={refreshAccessToken} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
            Refresh Token
          </button>
        </div>
      ) : (
        <button onClick={login} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Login
        </button>
      )}
    </div>
  );
};

export default App;