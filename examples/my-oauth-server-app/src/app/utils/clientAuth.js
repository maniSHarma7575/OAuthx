export async function fetchUserInfoDetails() {
  try {
    const response = await fetch("/api/user");
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}