import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Membership and pricing", description: "Learn what is available with TechForge and how paid memberships will work when configured." };

export default function PricingPage() {
  return <>
    <section className="page-hero"><span className="section-kicker">Clear access, no surprises</span><h1>Start with what’s<br /><em>open to you.</em></h1><p>Explore public career guides, learning path previews, and project ideas. Paid membership checkout is not yet available on TechForge.</p></section>
    <section className="page-content"><div className="pricing-grid">
      <article className="price-card"><span className="card-eyebrow">TECHFORGE / FREE</span><h2>Free</h2><p className="price-value">₦0 <span>always</span></p><p className="price-description">A useful place to discover technology and plan your next steps.</p><ul><li>✓ Public skill and career guides</li><li>✓ Learning path curriculum previews</li><li>✓ Project ideas and checklists</li><li>✓ No payment details required</li></ul><Link className="button button-full" href="/skills">Explore free content <span aria-hidden="true">↗</span></Link></article>
      <article className="price-card price-card-muted"><span className="card-eyebrow">TECHFORGE / PRO</span><h2>Pro</h2><p className="price-value">Not available</p><p className="price-description">We haven’t configured paid plans, pricing, or checkout yet.</p><ul><li>— No paid entitlements are being sold</li><li>— No subscription payment is collected</li><li>— No renewal or cancellation is implied</li></ul><button className="button button-disabled" type="button" disabled>Coming later</button><small>We’ll publish terms and exact prices before launch.</small></article>
    </div><section className="price-notes"><h2>Before you subscribe</h2><p>TechForge does not currently offer paid subscriptions or process payments. There are no renewal charges or cancellation steps at this time. If paid plans become available, their prices, billing intervals, renewal terms, cancellation process, and access after cancellation will be clearly described before checkout.</p><Link href="/subscription-policy" className="text-link">Read the subscription policy <span aria-hidden="true">↗</span></Link></section></section>
  </>;
}
