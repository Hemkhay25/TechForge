import type { Metadata } from "next";

export const metadata: Metadata = { title: "Subscription policy" };

export default function SubscriptionPolicyPage() {
  return <>
    <section className="page-hero"><span className="section-kicker">Payments / Current status</span><h1>No subscriptions<br /><em>are on sale.</em></h1><p>There are no active paid membership plans or payment checkouts on TechForge right now.</p></section>
    <div className="prose-block"><div className="prose-note">Current status: paid plans and Paystack checkout are not configured. TechForge does not currently collect subscription payments.</div><h2>Billing and renewal</h2><p>No subscription billing interval, renewal, or payment-failure process is active because no paid plan is currently offered.</p><h2>Cancellation and access</h2><p>There is no paid subscription to cancel. Public learning materials remain available without a paid membership.</p><h2>When paid plans become available</h2><p>Before checkout is enabled, TechForge will publish the plan price and currency, billing interval, renewal terms, cancellation process, access after cancellation, and how failed payments are handled. Payment verification will be performed server-side.</p><h2>Questions</h2><p>For questions about the current status, use the contact form. It will confirm whether a message was saved and will not claim that an email was delivered.</p></div>
  </>;
}
