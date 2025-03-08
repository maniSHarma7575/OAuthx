import Image from "next/image";
import "../globals.css";

export default function UserProfile({ name, email, picture }) {
  return (
    <div className="text-center">
      {picture && (
        <Image
          src={picture}
          alt="Profile picture"
          width={100}
          height={100}
          className="profile-picture"
        />
      )}
      <h1 className="title">Name: {name}!</h1>
      <p className="text-gray">Email: {email}</p>
      <a href="/api/logout" className="button logout">
        Logout
      </a>
    </div>
  );
}