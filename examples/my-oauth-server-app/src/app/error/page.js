"use client";

import { useRouter } from "next/navigation";

const ErrorPage = () => {
  const router = useRouter();

  return (
    <div className="error-container">
      <h2>Something went wrong</h2>
      <p>{`We're sorry, but we couldn't complete the authentication process.`}</p>
      <button onClick={() => router.push("/")} className="retry-button">
        Go to Home
      </button>
    </div>
  );
};

export default ErrorPage;