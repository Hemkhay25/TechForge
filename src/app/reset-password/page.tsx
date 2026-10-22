import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/auth-forms";

export const metadata: Metadata = { title: "Choose a new password" };

export default function ResetPasswordPage() {
  return <section className="auth-wrap"><div className="auth-aside"><span className="section-kicker">Secure your account</span><h1>A fresh start<br />for your <em>account.</em></h1><p>Open this page from the password reset link sent to your email address.</p></div><div className="auth-form-panel"><UpdatePasswordForm /></div></section>;
}
