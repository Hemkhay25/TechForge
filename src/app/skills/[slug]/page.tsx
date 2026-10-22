import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedSkills, getPublishedPaths } from "@/lib/public-content";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const available = await getPublishedSkills();
  const skill = available.find((item) => item.slug === slug);
  return skill ? { title: skill.title, description: skill.description } : {};
}

export default async function SkillDetailPage({ params }: Props) {
  const { slug } = await params;
  const availableSkills = await getPublishedSkills();
  const availablePaths = await getPublishedPaths();
  const skill = availableSkills.find((item) => item.slug === slug);
  if (!skill) notFound();
  const relatedPaths = availablePaths.filter((path) => path.category === skill.category);
  const responsibilities = skill.slug === "ui-ux-design"
    ? ["Understand user needs through research", "Organise information and interactions", "Prototype and test design ideas", "Work with developers and product teams"]
    : skill.slug === "data-analysis"
      ? ["Ask clear questions of a dataset", "Clean and query information", "Create useful charts and summaries", "Explain limitations and findings"]
      : skill.slug === "cybersecurity"
        ? ["Help identify and reduce digital risk", "Follow responsible security practices", "Review systems and security signals", "Communicate practical recommendations"]
        : ["Understand a real user or business problem", "Choose tools suited to the task", "Build, test, or improve digital solutions", "Explain decisions and collaborate with others"];
  return <>
    <section className="detail-hero"><span className="section-kicker">{skill.category} / Career guide</span><h1>{skill.title}</h1><p>{skill.description} Explore what this area involves, the foundations that help, and practical next steps to try.</p></section>
    <div className="detail-layout"><div className="detail-main">
      <section className="detail-block"><h2>What is {skill.title.toLowerCase()}?</h2><p>{skill.title} is a broad area of technology work. The day-to-day can vary across teams and industries, but the shared thread is using technology and careful problem-solving to make something work better for people.</p><p>You do not need to know everything before you begin. Start with the fundamentals, practise on small projects, and notice which parts of the work keep you curious.</p></section>
      <section className="detail-block"><h2>What might you work on?</h2><ul className="check-list">{responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></section>
      <section className="detail-block"><h2>Helpful foundations</h2><p>Curiosity, patience, clear communication, and a willingness to learn from feedback are useful in every technology career. Depending on your direction, you may also explore:</p><ul className="check-list"><li>Comfort using a computer and the web</li><li>Breaking a problem into smaller steps</li><li>Explaining your reasoning clearly</li><li>Practising with a small personal project</li></ul></section>
      <section className="detail-block"><h2>Try a learning path</h2><p>These paths offer a structured place to practise. You can preview their curriculum without an account.</p><div className="related-paths">{relatedPaths.length ? relatedPaths.map((path) => <Link href={`/paths/${path.slug}`} className="related-path" key={path.slug}><span className={`icon-tile ${path.color}`} aria-hidden="true">{path.icon}</span><span><strong>{path.title}</strong><small>{path.duration} · {path.lessons} lessons</small></span><span aria-hidden="true">↗</span></Link>) : <Link href="/paths" className="text-link">Browse all learning paths ↗</Link>}</div></section>
      <section className="detail-block"><h2>Keep your expectations grounded</h2><p>Career titles, responsibilities, and opportunities differ between employers and locations. A learning path can help you practise and build evidence of your skills, but it cannot guarantee employment or a particular outcome.</p></section>
    </div><aside className="detail-aside"><h2>At a glance</h2><ul><li>Starting level <strong>{skill.level}</strong></li><li>Estimated commitment <strong>{skill.commitment}</strong></li><li>Area <strong>{skill.category}</strong></li><li>Good first step <strong>Explore a path</strong></li></ul><Link href={`/paths/${relatedPaths[0]?.slug ?? "web-development-foundations"}`} className="button button-full">See a learning path <span aria-hidden="true">↗</span></Link><p className="field-hint">Commitments are estimates, not guarantees. Learn at a pace that works for you.</p></aside></div>
  </>;
}
