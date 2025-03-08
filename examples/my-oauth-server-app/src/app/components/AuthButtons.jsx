import "../globals.css";

export default function AuthButtons() {
  return (
    <div className="text-center">
      <h1 className="title">OAuthX PKCE Flow</h1>
      <a href="/api/login" className="button login">
        Login
      </a>
    </div>
  );
}