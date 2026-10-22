import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedProjects } from "@/lib/public-content";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const projects = await getPublishedProjects();
  const project = projects.find((item) => item.slug === slug);
  return project ? { title: project.title, description: project.description } : {};
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const projects = await getPublishedProjects();
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return <>
    <section className="detail-hero"><span className="section-kicker">{project.category} / Project idea</span><h1>{project.title}</h1><p>{project.description}</p><div className="detail-hero-meta"><span>{project.level}</span><span>{project.effort} estimated</span><span>Self-directed project</span></div></section>
    <div className="detail-layout"><div className="detail-main">
      <section className="detail-block"><h2>What you’ll make</h2><p>{project.outcome} Treat this as a starting point: choose a clear audience and adapt the idea to a question or need you care about.</p></section>
      <section className="detail-block"><h2>Skills to practise</h2><ul className="check-list">{project.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul></section>
      <section className="detail-block"><h2>A simple way to begin</h2><div className="project-checklist">{["Write down who this project is for and what it should help them do.", "Sketch the smallest version that could demonstrate the core idea.", "Build or document that version, then ask someone to review it.", "Record what worked, what you changed, and what you would try next."].map((step, index) => <div className="project-check" key={step}><span>0{index + 1}</span><p>{step}</p></div>)}</div></section>
      <section className="detail-block"><h2>Define your outcome</h2><p>Before you start, write down what you want to show when the project is complete. A clear outcome makes it easier to keep the scope manageable and explain what you learned.</p><p>Do not include private information or credentials in a public portfolio. If you share your work, make sure you have permission to share any data or material you used.</p></section>
      <Link href="/projects" className="text-link">Back to project ideas <span aria-hidden="true">↗</span></Link>
    </div><aside className="detail-aside"><h2>Project overview</h2><ul><li>Area <strong>{project.category}</strong></li><li>Level <strong>{project.level}</strong></li><li>Estimated effort <strong>{project.effort}</strong></li></ul><p className="field-hint">Effort varies with your experience and available time. There is no deadline or guaranteed outcome.</p><Link href="/paths" className="button button-full">Find a learning path <span aria-hidden="true">↗</span></Link></aside></div>
  </>;
}
