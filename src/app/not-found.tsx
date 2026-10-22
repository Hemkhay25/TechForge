import Link from "next/link";

export default function NotFound() {
  return <section className="not-found"><span className="section-kicker">Not found / 404</span><h1>This page took<br /><em>a different path.</em></h1><p>The page may have moved, or it may not be published. Try exploring a skill or learning path instead.</p><div><Link className="button" href="/skills">Explore skills <span aria-hidden="true">↗</span></Link><Link className="text-link" href="/">Back to home <span aria-hidden="true">↗</span></Link></div></section>;
}
