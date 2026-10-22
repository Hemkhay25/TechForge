import type { Metadata } from "next";
import Link from "next/link";
import { faqs } from "@/lib/content";

export const metadata: Metadata = { title: "Help centre", description: "Answers to common questions about getting started with TechForge." };

export default function HelpPage() {
  return <>
    <section className="page-hero"><span className="section-kicker">Help centre</span><h1>A few answers<br />to help you <em>begin.</em></h1><p>Learn how to explore TechForge and what to expect from the platform today.</p></section>
    <div className="prose-block"><h2>Getting started</h2><p>Browse skill guides, preview a learning path, and choose a project idea that feels manageable. You can view public content without creating an account.</p><h2>Account features</h2><p>Registration, login, email verification, and personal progress depend on the TechForge Supabase project being configured. The interface will show a clear message if these services are unavailable.</p><h2>Payments and memberships</h2><p>Paid memberships and Paystack checkout have not been configured. No payment is collected through TechForge at this time.</p><h2>Common questions</h2><div className="faq-list">{faqs.map((faq, index) => <details className="faq-item" key={faq.question}><summary><span className="faq-index">0{index + 1}</span><span>{faq.question}</span><span className="faq-plus" aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div><h2>Still need help?</h2><p>Use the contact form to send a message. Messages are stored only after a database has been configured; email delivery is not yet connected.</p><Link className="button" href="/contact">Contact TechForge <span aria-hidden="true">↗</span></Link></div>
  </>;
}
