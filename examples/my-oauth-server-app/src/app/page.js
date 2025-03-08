import UserProfile from "./components/UserProfile";
import AuthButtons from "./components/AuthButtons";
import { fetchUserInfoDetails } from "./utils/auth";
import "./globals.css";

export default async function Home() {
  const userData = await fetchUserInfoDetails();

  return (
    <div className="container">
      <main className="main">
        {userData ? (
          <UserProfile name={userData.name} email={userData.email} picture={userData.picture} />
        ) : (
          <AuthButtons />
        )}
      </main>
    </div>
  );
}