import Link from "next/link";
import { faqs } from "@/lib/content";
import { getPublishedCategories, getPublishedPaths, getPublishedProjects, getPublishedSkills } from "@/lib/public-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [categories, paths, projects, skills] = await Promise.all([
    getPublishedCategories(),
    getPublishedPaths(),
    getPublishedProjects(),
    getPublishedSkills(),
  ]);
  return (
    <>
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-inner">
          <div className="hero-copy"><div className="eyebrow"><span className="status-dot" /> Your next chapter starts here</div>
            <h1>Your future<br />in tech <span>starts here.</span></h1>
            <p>Discover what you could do, learn at your own pace, and build things that show what you know.</p>
            <div className="hero-actions"><Link href="/skills" className="button">Find my tech path <span aria-hidden="true">↗</span></Link><Link href="/paths" className="button button-outline">Explore learning paths</Link></div>
            <div className="hero-note"><span className="note-avatars" aria-hidden="true"><i>✳</i><i>⌘</i><i>◒</i></span><span>Start with the basics. Find your own pace.</span></div>
          </div>
          <div className="hero-art" role="img" aria-label="Illustration of connected technology learning paths">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="orbit-node node-code">&lt;/&gt;</div><div className="orbit-node node-data">⌁</div><div className="orbit-node node-design">◒</div><div className="orbit-node node-cloud">☁</div>
            <div className="art-core"><span className="brand-mark large" aria-hidden="true"><i /><i /><i /></span><strong>Make<br />your move.</strong><small>YOUR PATH, YOUR PACE</small></div>
            <span className="art-label label-top">DESIGN</span><span className="art-label label-bottom">DEVELOPMENT</span>
          </div>
        </div>
        <div className="hero-bottom"><span>LEARN WITH PURPOSE</span><span className="hero-line" /><span>BUILD WITH CONFIDENCE</span><span className="hero-line" /><span>GROW YOUR WAY</span></div>
      </section>
      <section className="section category-section">
        <div className="section-heading"><div><span className="section-kicker">A world of possibilities</span><h2>Find the work<br />that <em>fits you.</em></h2></div><Link href="/skills" className="text-link">Explore all skills <span aria-hidden="true">↗</span></Link></div>
        <div className="category-grid">{categories.map((category) => <Link href="/skills" className="category-card" key={category.name}><span className={`category-icon ${category.color}`}>{category.icon}</span><h3>{category.name}</h3><p>{category.count}</p><span className="category-arrow" aria-hidden="true">↗</span></Link>)}</div>
      </section>
      <section className="steps-band">
        <div className="steps-heading"><span className="section-kicker">The TechForge way</span><h2>Curiosity is a<br />great place <em>to start.</em></h2><p>No perfect starting point required. Just take the next step.</p><Link href="/about" className="text-link light-link">How we think about learning <span aria-hidden="true">↗</span></Link></div>
        <div className="steps-list">
          {[["01", "Discover", "Explore the kinds of work people do across technology."], ["02", "Choose a path", "Pick a practical roadmap that matches your interests."], ["03", "Learn by doing", "Build useful skills with lessons, exercises, and projects."], ["04", "Show your work", "Reflect on what you made and decide what comes next."]].map(([number, title, description]) => <div className="step-row" key={number}><span className="step-number">{number}</span><span className="step-icon" aria-hidden="true">{["⌕", "↗", "⌘", "✳"][Number(number) - 1]}</span><div><h3>{title}</h3><p>{description}</p></div><span className="step-arrow" aria-hidden="true">↗</span></div>)}
        </div>
      </section>
      <section className="section path-section">
        <div className="section-heading"><div><span className="section-kicker">A little structure goes a long way</span><h2>Paths with room<br />to <em>make them yours.</em></h2></div><Link href="/paths" className="text-link">See every learning path <span aria-hidden="true">↗</span></Link></div>
        <div className="card-grid path-grid">{paths.slice(0, 3).map((path) => <Link href={`/paths/${path.slug}`} className="path-card" key={path.slug}><div className={`path-illustration ${path.color}`}><span className="path-symbol">{path.icon}</span><span className="path-orbit" /><span className="path-orbit orbit-inner" /><span className="path-number">{String(paths.indexOf(path) + 1).padStart(2, "0")}</span></div><div className="path-card-body"><span className="card-eyebrow">{path.category} <span>·</span> {path.level}</span><h3>{path.title}</h3><p>{path.description}</p><div className="card-meta"><span>{path.duration}</span><span>{path.lessons} lessons</span></div><span className="path-cta">Explore path <span aria-hidden="true">↗</span></span></div></Link>)}</div>
      </section>
      <section className="project-feature">
        <div className="project-feature-art"><div className="feature-paper paper-back" /><div className="feature-paper paper-front"><span className="paper-label">FIELD NOTES / 001</span><div className="paper-shapes"><i /><i /><i /><i /></div><strong>Make something<br />meaningful.</strong><span className="paper-squiggle">↗</span></div><span className="feature-sticker">LEARN<br />BY DOING</span></div>
        <div className="project-feature-copy"><span className="section-kicker">A skill gets real when you use it</span><h2>Practice makes<br />your progress <em>visible.</em></h2><p>Start with a small project. Learn by making something useful, get curious about what could be better, then keep going.</p><Link href="/projects" className="button button-dark">Browse project ideas <span aria-hidden="true">↗</span></Link></div>
      </section>
      <section className="section project-mini-section"><div className="mini-heading"><span className="section-kicker">Pick a first project</span><Link href="/projects" className="text-link">All project ideas <span aria-hidden="true">↗</span></Link></div><div className="mini-project-grid">{projects.slice(0, 3).map((project, index) => <Link href="/projects" className="mini-project" key={project.slug}><span className={`mini-project-art mini-art-${index}`} aria-hidden="true">{["✳", "⌁", "◒"][index]}</span><span className="card-eyebrow">{project.category}</span><strong>{project.title}</strong><span className="mini-project-bottom">{project.level}<span>{project.effort}</span></span></Link>)}</div></section>
      <section className="section membership-section"><div className="membership-copy"><span className="section-kicker">Learning should be open to everyone</span><h2>A good place<br />to start is <em>free.</em></h2><p>Explore career guides and learning paths at your own pace. Premium memberships are not available yet; we’ll share clear details here when they are configured.</p><Link href="/pricing" className="text-link">See membership details <span aria-hidden="true">↗</span></Link></div><div className="membership-card"><div className="membership-card-top"><span className="membership-symbol">✳</span><span className="card-eyebrow">TECHFORGE / ACCESS</span></div><h3>Make learning<br />your own.</h3><ul><li><span>✓</span> Career and skill guides</li><li><span>✓</span> Beginner-friendly roadmaps</li><li><span>✓</span> Practical project ideas</li><li><span>✓</span> No payment details required</li></ul><Link href="/skills" className="button button-full">Explore what’s open <span aria-hidden="true">↗</span></Link><small>Paid plans are not currently configured.</small></div></section>
      <section className="section faq-section"><div className="faq-intro"><span className="section-kicker">Good questions</span><h2>Before you<br /><em>get going.</em></h2><p>Start with the basics. If something is still unclear, reach out and we’ll do our best to help.</p><Link href="/contact" className="text-link">Talk to TechForge <span aria-hidden="true">↗</span></Link></div><div className="faq-list">{faqs.map((faq, index) => <details className="faq-item" key={faq.question} open={index === 0}><summary><span className="faq-index">0{index + 1}</span><span>{faq.question}</span><span className="faq-plus" aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div></section>
      <section className="closing-cta"><span className="section-kicker">Your next step can be a small one</span><h2>Start where you are.<br /><em>See where you go.</em></h2><Link href="/skills" className="button">Explore your options <span aria-hidden="true">↗</span></Link><span className="closing-mark" aria-hidden="true">✳</span></section>
      <div className="sr-only">{skills.length} career areas and learning opportunities at TechForge.</div>
    </>
  );
}
