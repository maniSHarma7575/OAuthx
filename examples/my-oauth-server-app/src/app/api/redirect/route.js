import { handleAuthCallback } from "@/app/utils/serverAuth";

export async function GET(request) {
  try {
    const redirectPath = await handleAuthCallback(request.url);    
    const redirectUrl = new URL(redirectPath, request.nextUrl.origin);
    return Response.redirect(redirectUrl);
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}