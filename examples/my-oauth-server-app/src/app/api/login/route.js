import { initiateLoginFlow } from "@/app/utils/serverAuth";

export async function GET() {
  try {
    const authUrl = await initiateLoginFlow();
    return Response.redirect(authUrl);
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}