import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth-forms";

export const metadata: Metadata = { title: "Create an account" };

export default function RegisterPage() {
  return <section className="auth-wrap"><div className="auth-aside"><span className="section-kicker">Learn skills. Build projects.</span><h1>There’s no<br />one right way<br />to <em>begin.</em></h1><p>Create an account to get ready for personalised learning features. Email verification and secure account storage are provided through Supabase when configured.</p></div><div className="auth-form-panel"><RegisterForm /></div></section>;
}
