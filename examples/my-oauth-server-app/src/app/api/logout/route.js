import { flushCookieHeaders } from "@/app/utils/cookies";
import { NextResponse } from "next/server";

export async function GET() {
  const headers = flushCookieHeaders();
  return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL, { headers });
}