import { useState, useEffect } from "react";
import { handleAuthCallback, refreshAccessToken, fetchUserData, getStoredAccessToken } from "../services/authService";

const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      let accessToken = getStoredAccessToken(); // Check for valid stored token
      let tokenRespone;
      if (!accessToken) {
        tokenRespone = await handleAuthCallback();
        accessToken = tokenRespone?.access_token;
      }

      if (!accessToken) {
        tokenRespone = await refreshAccessToken();
        accessToken = tokenRespone?.access_token;
      }

      if (accessToken && !userData) {
        setToken(accessToken);
        const userInfo = await fetchUserData(accessToken);
        setUserData(userInfo);
      }

      // Remove auth params from URL
      const urlParams = new URLSearchParams(window.location.search);

      if (urlParams.has("code")) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    };

    initializeAuth();
  }, []);

  return { token, userData };
};

export default useAuth;
