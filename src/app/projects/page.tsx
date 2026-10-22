import type { Metadata } from "next";
import { ProjectExplorer } from "@/components/project-explorer";
import { getPublishedProjects } from "@/lib/public-content";

export const metadata: Metadata = { title: "Project ideas", description: "Find practical project ideas to apply and show what you are learning." };
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const items = await getPublishedProjects();
  return <>
    <section className="page-hero"><span className="section-kicker">Learn by making</span><h1>Small projects.<br /><em>Real progress.</em></h1><p>Choose an idea that fits where you are today. Start simple, make it useful, and add your own twist when you’re ready.</p></section>
    <section className="page-content"><ProjectExplorer items={items} /></section>
  </>;
}
