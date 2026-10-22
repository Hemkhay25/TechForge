import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Check your email" };

export default function VerifyEmailPage() {
  return <section className="auth-wrap"><div className="auth-aside"><span className="section-kicker">One last step</span><h1>Check your<br /><em>inbox.</em></h1><p>If email verification is enabled, Supabase has sent a confirmation message to the address you registered.</p></div><div className="auth-form-panel"><div className="auth-form"><h2>Verify your email</h2><p>Open the message from your email provider and follow its confirmation link. If it doesn’t arrive, check your spam folder or try registering again later.</p><div className="notice-box">This page does not verify an email by itself. Verification depends on your configured authentication provider.</div><Link className="button button-full" href="/login">Continue to log in</Link></div></div></section>;
}
