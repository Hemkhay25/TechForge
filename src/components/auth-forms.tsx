"use client";

import Link from "next/link";
import { useActionState } from "react";
import { contactAction, loginAction, registerAction, requestPasswordResetAction, updatePasswordAction, type ActionState } from "@/app/auth-actions";

const initialState: ActionState = { message: "", success: false };

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, initialState);
  return <form className="auth-form" action={action}>
    <h2>Create your account</h2><p>Start exploring at your own pace. We’ll only ask for what’s needed.</p>
    {state.message && <div className={`notice-box${state.success ? "" : " warning"}`} role="status">{state.message}</div>}
    <div className="field"><label htmlFor="fullName">Full name</label><input id="fullName" name="fullName" autoComplete="name" required minLength={2} maxLength={100} /></div>
    <div className="field"><label htmlFor="register-email">Email address</label><input id="register-email" name="email" type="email" autoComplete="email" required maxLength={254} /></div>
    <div className="field"><label htmlFor="register-password">Password</label><input id="register-password" name="password" type="password" autoComplete="new-password" required minLength={10} maxLength={72} /><span className="field-hint">Use at least 10 characters.</span></div>
    <div className="field"><label className="consent-label"><input name="consent" type="checkbox" required /> I agree to the <Link href="/terms">Terms</Link> and have read the <Link href="/privacy">Privacy notice</Link>.</label></div>
    <button className="button" type="submit" disabled={pending}>{pending ? "Creating account…" : "Create account"} <span aria-hidden="true">↗</span></button>
    <p className="auth-switch">Already have an account? <Link href="/login">Log in</Link></p>
  </form>;
}

export function LoginForm({ callbackFailed = false }: { callbackFailed?: boolean }) {
  const [state, action, pending] = useActionState(loginAction, initialState);
  return <form className="auth-form" action={action}>
    <h2>Welcome back</h2><p>Log in to continue learning and keep your progress in one place.</p>
    {callbackFailed && <div className="notice-box warning" role="alert">We couldn&apos;t verify that email link. It may have expired; request a fresh link and try again.</div>}
    {state.message && <div className="notice-box warning" role="alert">{state.message}</div>}
    <div className="field"><label htmlFor="login-email">Email address</label><input id="login-email" name="email" type="email" autoComplete="email" required maxLength={254} /></div>
    <div className="field"><label htmlFor="login-password">Password</label><input id="login-password" name="password" type="password" autoComplete="current-password" required maxLength={72} /></div>
    <p className="field-hint"><Link href="/forgot-password">Forgot your password?</Link></p>
    <button className="button" type="submit" disabled={pending}>{pending ? "Logging in…" : "Log in"} <span aria-hidden="true">↗</span></button>
    <p className="auth-switch">New to TechForge? <Link href="/register">Create an account</Link></p>
  </form>;
}

export function ContactForm() {
  const [state, action, pending] = useActionState(contactAction, initialState);
  return <form className="contact-form" action={action}>
    {state.message && <div className={`notice-box${state.success ? "" : " warning"}`} role="status">{state.message}</div>}
    <div className="field"><label htmlFor="contact-name">Name</label><input id="contact-name" name="name" autoComplete="name" required minLength={2} maxLength={100} /></div>
    <div className="field"><label htmlFor="contact-email">Email</label><input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} /></div>
    <div className="field"><label htmlFor="contact-subject">Subject</label><input id="contact-subject" name="subject" required minLength={3} maxLength={160} /></div>
    <div className="field"><label htmlFor="contact-message">Message</label><textarea id="contact-message" name="message" required minLength={10} maxLength={5000} /></div>
    <div className="honeypot" aria-hidden="true"><label htmlFor="website">Leave this field empty</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
    <button className="button" type="submit" disabled={pending}>{pending ? "Sending…" : "Send message"} <span aria-hidden="true">↗</span></button>
  </form>;
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordResetAction, initialState);
  return <form className="auth-form" action={action}>
    <h2>Reset your password</h2><p>Enter the email address on your account. If it exists, we’ll send a reset link.</p>
    {state.message && <div className={`notice-box${state.success ? "" : " warning"}`} role="status">{state.message}</div>}
    <div className="field"><label htmlFor="reset-email">Email address</label><input id="reset-email" name="email" type="email" autoComplete="email" required maxLength={254} /></div>
    <button className="button" type="submit" disabled={pending}>{pending ? "Requesting…" : "Send reset link"} <span aria-hidden="true">↗</span></button>
    <p className="auth-switch"><Link href="/login">Back to log in</Link></p>
  </form>;
}

export function UpdatePasswordForm() {
  const [state, action, pending] = useActionState(updatePasswordAction, initialState);
  return <form className="auth-form" action={action}>
    <h2>Choose a new password</h2><p>Use at least 10 characters for your new password.</p>
    {state.message && <div className="notice-box warning" role="alert">{state.message}</div>}
    <div className="field"><label htmlFor="new-password">New password</label><input id="new-password" name="password" type="password" autoComplete="new-password" required minLength={10} maxLength={72} /></div>
    <button className="button" type="submit" disabled={pending}>{pending ? "Updating…" : "Update password"} <span aria-hidden="true">↗</span></button>
  </form>;
}
