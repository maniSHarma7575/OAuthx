"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "../globals.css";
import { handleOAuthCallback } from "../utils/oauthCallback";

const OAuthCallback = () => {
  const router = useRouter();

  useEffect(() => {
    handleOAuthCallback(router);
  }, [router]);

  return (
    <div className="auth-container">
      <h2>Resolving the redirect URL ...</h2>
    </div>
  );
};

export default OAuthCallback;