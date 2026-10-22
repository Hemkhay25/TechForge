import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedPaths } from "@/lib/public-content";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const available = await getPublishedPaths();
  const path = available.find((item) => item.slug === slug);
  return path ? { title: path.title, description: path.description } : {};
}

export default async function LearningPathPage({ params }: Props) {
  const { slug } = await params;
  const available = await getPublishedPaths();
  const path = available.find((item) => item.slug === slug);
  if (!path) notFound();
  return <>
    <section className="detail-hero"><span className="section-kicker">{path.category} / Learning path</span><h1>{path.title}</h1><p>{path.description} Follow the curriculum in order or use it as a guide to your own learning.</p><div className="detail-hero-meta"><span>{path.level}</span><span>{path.duration} estimated</span><span>{path.lessons} lessons</span><span>Free preview</span></div></section>
    <div className="detail-layout"><div className="detail-main">
      <section className="detail-block"><h2>What you’ll explore</h2><p>This path is designed to help you build a foundation and apply it through small, practical exercises. There’s no rush: revisit topics and take time to practise.</p><ul className="check-list"><li>Understand the core concepts</li><li>Practise with guided activities</li><li>Build a small project to apply your learning</li><li>Reflect on possible next steps</li></ul></section>
      <section className="detail-block"><h2>Your curriculum</h2><div className="curriculum">{path.modules.map((module, index) => <details key={module.title} open={index === 0}><summary><span className="module-count">MODULE 0{index + 1}</span> &nbsp; {module.title} <span className="module-total">{module.lessons.length} lessons</span></summary><ul>{module.lessons.map((lesson) => <li key={lesson}>{lesson} <span className="preview-label">Preview</span></li>)}</ul></details>)}</div></section>
      <section className="detail-block"><h2>Make the learning yours</h2><p>Set a manageable weekly goal, keep notes on questions you want to revisit, and try explaining a concept in your own words. The estimated schedule is only a guide.</p><Link href="/projects" className="text-link">Find a related project <span aria-hidden="true">↗</span></Link></section>
    </div><aside className="detail-aside"><h2>Path overview</h2><ul><li>Skill area <strong>{path.category}</strong></li><li>Level <strong>{path.level}</strong></li><li>Estimated pace <strong>{path.duration}</strong></li><li>Lessons <strong>{path.lessons}</strong></li></ul><Link href="/register" className="button button-full">Create a free account <span aria-hidden="true">↗</span></Link><p className="field-hint">Personal progress tracking requires an account and a configured authentication service.</p></aside></div>
  </>;
}
