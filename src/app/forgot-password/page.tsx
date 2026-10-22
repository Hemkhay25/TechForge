import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth-forms";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return <section className="auth-wrap"><div className="auth-aside"><span className="section-kicker">Account help</span><h1>Get back to<br /><em>your learning.</em></h1><p>Password reset links are sent only when the authentication service is configured.</p></div><div className="auth-form-panel"><ForgotPasswordForm /></div></section>;
}
