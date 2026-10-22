import type { Metadata } from "next";
import { SkillExplorer } from "@/components/skill-explorer";
import { getPublishedSkills } from "@/lib/public-content";

export const metadata: Metadata = { title: "Explore technology skills", description: "Browse technology career areas and find a beginner-friendly skill to explore." };
export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  const items = await getPublishedSkills();
  return <>
    <section className="page-hero"><span className="section-kicker">Explore the possibilities</span><h1>There’s more than<br />one way <em>into tech.</em></h1><p>Get to know different kinds of technology work. Search by interest, explore a skill, and see where a learning path could take you.</p></section>
    <section className="page-content"><SkillExplorer items={items} /></section>
  </>;
}
