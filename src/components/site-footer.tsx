import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link href="/" className="brand"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>tech<span className="brand-light">forge</span></span></Link>
          <p>Learn skills. Build projects.<br />Forge your future.</p>
        </div>
        <div className="footer-column"><h2>Explore</h2><Link href="/skills">Skills</Link><Link href="/paths">Learning paths</Link><Link href="/projects">Projects</Link><Link href="/pricing">Pricing</Link></div>
        <div className="footer-column"><h2>TechForge</h2><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/help">Help centre</Link><Link href="/login">Your account</Link></div>
        <div className="footer-column"><h2>Policies</h2><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/subscription-policy">Subscriptions</Link></div>
      </div>
      <div className="footer-bottom"><span>© TechForge</span><span>Built for curious minds, wherever they are.</span></div>
    </footer>
  );
}
