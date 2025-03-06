import React from "react";

const UserInfo = ({ userData }) => {
  if (!userData) return null;

  return (
    <div className="user-info">
      <img src={userData.picture} alt={userData.name} className="avatar" />
      <h2>{`Nickname: ${userData.nickname}`}</h2>
      <p>{`Name: ${userData.name}`}</p>
      <p>{`Email: ${userData.email}`}</p>
    </div>
  );
};

export default UserInfo;
