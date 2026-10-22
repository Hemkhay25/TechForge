"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { projects } from "@/lib/content";

export function ProjectExplorer({ items = projects }: { items?: typeof projects }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All areas");
  const filtered = useMemo(() => items.filter((project) =>
    (category === "All areas" || project.category === category) &&
    (!query || `${project.title} ${project.description} ${project.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase()))
  ), [category, items, query]);
  return <>
    <div className="explorer-controls">
      <label className="search-box"><span aria-hidden="true">⌕</span><span className="sr-only">Search projects</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search project ideas" /></label>
      <label className="select-label"><span className="sr-only">Filter projects by area</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option>All areas</option>{Array.from(new Set(items.map((project) => project.category))).map((item) => <option key={item}>{item}</option>)}</select></label>
    </div>
    <p className="result-count" aria-live="polite">{filtered.length} project ideas</p>
    {filtered.length ? <div className="project-list">{filtered.map((project, index) => <Link href={`/projects/${project.slug}`} className="project-card" key={project.slug}><div className={`project-number project-color-${index % 4}`}>0{index + 1}</div><div className="project-copy"><div className="card-eyebrow">{project.category} <span>·</span> {project.level}</div><h2>{project.title}</h2><p>{project.description}</p><div className="tag-list">{project.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div><div className="project-outcome"><span>ESTIMATED EFFORT</span><strong>{project.effort}</strong><small>{project.outcome}</small></div></Link>)}</div> : <div className="empty-state"><h2>No project matches</h2><p>Try searching for a different topic.</p><button className="button button-quiet" type="button" onClick={() => { setQuery(""); setCategory("All areas"); }}>Clear filters</button></div>}
  </>;
}
