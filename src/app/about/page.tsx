import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "About TechForge", description: "The TechForge mission and learning philosophy." };

export default function AboutPage() {
  return <>
    <section className="page-hero"><span className="section-kicker">Why TechForge exists</span><h1>Technology is for<br /><em>more people.</em></h1><p>We want the first steps into technology to feel clearer, more practical, and more welcoming—wherever you are starting from.</p></section>
    <div className="prose-block"><h2>Our mission</h2><p>TechForge helps people discover technology careers, explore structured learning, practise with projects, and make informed choices about what to learn next.</p><h2>How we think about learning</h2><p>Good learning should be understandable, practical, and honest. We aim to explain unfamiliar ideas in plain language, show how they connect to real work, and give learners opportunities to try things for themselves.</p><ul><li>Start with useful foundations rather than assumed experience.</li><li>Pair explanations with exercises and practical projects.</li><li>Respect different learning paces and circumstances.</li><li>Be honest about uncertainty, access, and outcomes.</li></ul><h2>Opportunity without guarantees</h2><p>Technology work changes quickly, and career paths differ by location and experience. TechForge can provide learning structure, but cannot guarantee employment, earnings, or a particular career outcome.</p><div className="prose-note">TechForge is an education platform in development. We do not claim a founding history, learner success statistics, or partnerships that have not been established.</div><h2>Take a first look</h2><p>Explore a skill that interests you, preview a path, or find a small project idea to try.</p><Link className="button" href="/skills">Explore skills <span aria-hidden="true">↗</span></Link></div>
  </>;
}
