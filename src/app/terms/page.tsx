import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of service — draft" };

export default function TermsPage() {
  return <>
    <section className="page-hero"><span className="section-kicker">Policy / Draft</span><h1>Terms of service<br /><em>for review.</em></h1><p>This initial draft requires legal and product review before launch.</p></section>
    <div className="prose-block"><div className="prose-note">DRAFT — Have this document reviewed by qualified counsel and adapt it to the final service, payment configuration, and applicable jurisdictions before launch.</div><h2>Using TechForge</h2><p>TechForge provides educational information, learning path previews, and project ideas. Users should use the service lawfully and respectfully and must not attempt to access accounts, content, or systems they are not authorised to use.</p><h2>Educational information</h2><p>Content is provided for general educational purposes. Technology practices change, and content may not cover every circumstance. Users are responsible for evaluating whether guidance is appropriate for their situation.</p><h2>No employment promise</h2><p>TechForge does not guarantee employment, income, certification, or any particular career outcome.</p><h2>Accounts and availability</h2><p>Account features require the configured authentication service. Users are responsible for protecting their account credentials. Features may be unavailable during maintenance or while services are being configured.</p><h2>Paid services</h2><p>TechForge does not currently offer paid subscriptions or process payments. If this changes, separate, complete payment and cancellation terms must be presented before a user purchases a plan.</p><h2>Review before launch</h2><p>Governing law, limitation of liability, dispute resolution, intellectual property, account termination, and other required terms must be completed with qualified legal review before launch.</p></div>
  </>;
}
