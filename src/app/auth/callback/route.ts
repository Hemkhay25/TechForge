import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const allowedDestinations = new Set(["/dashboard", "/reset-password"]);

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const requestedDestination = request.nextUrl.searchParams.get("next") ?? "/dashboard";
  const destination = allowedDestinations.has(requestedDestination) ? requestedDestination : "/dashboard";
  const supabase = await createSupabaseServerClient();

  if (!code || !supabase) return NextResponse.redirect(new URL("/login?error=callback", request.url));

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("Supabase auth callback failed", error.code);
    return NextResponse.redirect(new URL("/login?error=callback", request.url));
  }

  return NextResponse.redirect(new URL(destination, request.url));
}
