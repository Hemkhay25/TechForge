import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth-forms";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <section className="auth-wrap"><div className="auth-aside"><span className="section-kicker">Your learning, your pace</span><h1>Pick up where<br />your curiosity<br /><em>left off.</em></h1><p>Sign in to continue a learning path and see your progress. Account features require a configured authentication service.</p><Link className="text-link" href="/paths">Preview paths without an account <span aria-hidden="true">↗</span></Link></div><div className="auth-form-panel"><LoginForm callbackFailed={error === "callback"} /></div></section>;
}
