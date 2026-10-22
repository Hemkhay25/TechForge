import type { Metadata } from "next";
import { ContactForm } from "@/components/auth-forms";

export const metadata: Metadata = { title: "Contact TechForge", description: "Send a message to the TechForge team." };

export default function ContactPage() {
  return <>
    <section className="page-hero"><span className="section-kicker">We’re listening</span><h1>What’s on<br /><em>your mind?</em></h1><p>Share a question, a suggestion, or something that would make your learning experience better. We don’t publish an address or phone number that hasn’t been configured.</p></section>
    <section className="page-content"><ContactForm /><p className="field-hint" style={{ maxWidth: 600, margin: "14px auto" }}>Messages are saved to the configured TechForge database; this form does not send email. When storage is not configured, your message is not submitted.</p></section>
  </>;
}
