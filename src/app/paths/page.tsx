import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPaths } from "@/lib/public-content";

export const metadata: Metadata = { title: "Learning paths", description: "Explore structured, beginner-friendly technology learning paths from TechForge." };
export const dynamic = "force-dynamic";

export default async function PathsPage() {
  const items = await getPublishedPaths();
  return <>
    <section className="page-hero"><span className="section-kicker">A roadmap, not a race</span><h1>Learning paths<br />to help you <em>get moving.</em></h1><p>Start with foundations, practise along the way, and build confidence one useful step at a time. Preview every curriculum before choosing a direction.</p></section>
    <section className="page-content"><div className="card-grid path-grid">{items.map((path, index) => <Link href={`/paths/${path.slug}`} className="path-card" key={path.slug}><div className={`path-illustration ${path.color}`}><span className="path-symbol">{path.icon}</span><span className="path-orbit" /><span className="path-orbit orbit-inner" /><span className="path-number">{String(index + 1).padStart(2, "0")}</span></div><div className="path-card-body"><span className="card-eyebrow">{path.category} <span>·</span> {path.level}</span><h3>{path.title}</h3><p>{path.description}</p><div className="card-meta"><span>{path.duration}</span><span>{path.lessons} lessons</span></div><span className="path-cta">Preview curriculum <span aria-hidden="true">↗</span></span></div></Link>)}</div><p className="field-hint" style={{ marginTop: 22 }}>Learning commitments are estimates. No paid access is required for these published previews.</p></section>
  </>;
}
