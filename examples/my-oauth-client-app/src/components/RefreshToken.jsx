import { refreshAccessToken } from "../services/authService";

const RefreshTokenButton = () => {
  const handleRefresh = async () => {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      window.location.reload();
    } else {
      console.error("Failed to refresh token");
    }
  };

  return (
    <div>
      <br/>
      <button onClick={handleRefresh} className="btn">Refresh Token</button>
    </div>
  );
};

export default RefreshTokenButton;