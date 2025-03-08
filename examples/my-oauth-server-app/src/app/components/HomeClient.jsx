"use client";

import { useEffect, useState } from "react";
import UserProfile from "./UserProfile";
import AuthButtons from "./AuthButtons";
import { fetchUserInfoDetails } from "../utils/clientAuth";

const HomeClient = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchUserInfoDetails();
      setUserData(data);
    };

    fetchData();
  }, []);

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
};

export default HomeClient;
