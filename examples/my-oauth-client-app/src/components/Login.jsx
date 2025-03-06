import React from "react";
import { login, logout } from "../services/authService";

const Login = ({ token }) => {
  return (
    <div className="login-container">
      {!token ? (
        <button onClick={login} className="btn">Login</button>
      ) : (
        <button onClick={logout} className="btn logout">Logout</button>
      )}
    </div>
  );
};

export default Login;
