import React from "react";
import Login from "./components/Login";
import UserInfo from "./components/UserInfo";
import useAuth from "./hooks/useAuth";
import RefreshTokenButton from "./components/RefreshToken";

const App = () => {
  const { token, userData } = useAuth();

  return (
    <div className="container">
      <h1>OAuthX PKCE Flow </h1>
      <Login token={token} />
      { token ? <RefreshTokenButton /> : ''}
      <UserInfo userData={userData} />
    </div>
  );
};

export default App;