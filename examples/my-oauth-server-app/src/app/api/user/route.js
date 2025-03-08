import { getAccessToken } from "@/app/utils/serverAuth";
import { AUTH_SERVER } from "../../utils/oauthClient";

export async function GET() {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(`${AUTH_SERVER}/user-info`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) throw new Error("Failed to fetch user info");

    return new Response(await response.text(), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: error.message === "Unauthorized" ? 401 : 500 });
  }
}