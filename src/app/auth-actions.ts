"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ActionState = { message: string; success: boolean };

const registrationSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your name.").max(100, "Name is too long."),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  password: z.string().min(10, "Use at least 10 characters.").max(72, "Password is too long."),
  consent: z.literal("on", { error: "Please accept the terms and privacy notice." }),
});

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(254),
  password: z.string().min(1, "Enter your password.").max(72),
});

const emailSchema = z.object({ email: z.string().trim().email("Enter a valid email address.").max(254) });
const passwordResetSchema = z.object({ password: z.string().min(10, "Use at least 10 characters.").max(72) });

export async function registerAction(_previousState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = registrationSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    consent: formData.get("consent"),
  });
  if (!parsed.success) return { message: parsed.error.issues[0]?.message ?? "Check your details and try again.", success: false };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { message: "Account creation is not configured yet. Add the Supabase environment values and database migration to enable registration.", success: false };

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback?next=%2Fdashboard`,
    },
  });
  if (error) return { message: error.message, success: false };
  if (data.session) redirect("/dashboard");
  redirect("/verify-email");
}

export async function loginAction(_previousState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { message: parsed.error.issues[0]?.message ?? "Check your details and try again.", success: false };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { message: "Login is not configured yet. Add the Supabase environment values and database migration to enable accounts.", success: false };

  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { message: error.message, success: false };
  redirect("/dashboard");
}

export async function requestPasswordResetAction(_previousState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = emailSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { message: parsed.error.issues[0]?.message ?? "Enter a valid email address.", success: false };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { message: "Password reset is not configured yet. Contact support for help.", success: false };
  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback?next=%2Freset-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo });
  if (error) return { message: "We couldn't request a password reset. Please try again later.", success: false };
  return { message: "If an account exists for that address, a password reset link has been sent.", success: true };
}

export async function updatePasswordAction(_previousState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = passwordResetSchema.safeParse({ password: formData.get("password") });
  if (!parsed.success) return { message: parsed.error.issues[0]?.message ?? "Check your password.", success: false };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { message: "Password reset is not configured yet.", success: false };
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return { message: "This password reset link is invalid or expired. Request a new one.", success: false };
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { message: error.message, success: false };
  redirect("/dashboard");
}

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(100),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  subject: z.string().trim().min(3, "Add a subject.").max(160),
  message: z.string().trim().min(10, "Please add a little more detail.").max(5000),
  website: z.string().max(0, "Invalid submission."),
});

export async function contactAction(_previousState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    website: formData.get("website") ?? "",
  });
  if (!parsed.success) return { message: parsed.error.issues[0]?.message ?? "Check the form and try again.", success: false };

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { message: "Your message was not sent or saved. Contact submissions are not configured yet.", success: false };
  const { error } = await supabase.from("contact_submissions").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });
  if (error) {
    console.error("Contact submission could not be saved", error.code);
    return { message: "We couldn't save your message. Please try again later.", success: false };
  }
  return { message: "Your message has been saved. It has not been emailed; contact email delivery is not configured.", success: true };
}
