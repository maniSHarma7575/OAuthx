import { cookies } from "next/headers";

export async function fetchUserInfoDetails() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return null; // No access token found
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVER}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("API Call failed for userInfo");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}