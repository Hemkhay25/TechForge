"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { categories, skills } from "@/lib/content";

export function SkillExplorer({ items = skills }: { items?: typeof skills }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All areas");
  const [level, setLevel] = useState("All levels");
  const [sort, setSort] = useState("Recommended");
  const results = useMemo(() => {
    const search = query.trim().toLowerCase();
    const filtered = items.filter((skill) =>
      (!search || `${skill.title} ${skill.description} ${skill.category}`.toLowerCase().includes(search)) &&
      (category === "All areas" || skill.category === category) &&
      (level === "All levels" || skill.level === level)
    );
    return sort === "A–Z" ? [...filtered].sort((a, b) => a.title.localeCompare(b.title)) : filtered;
  }, [category, items, level, query, sort]);

  return (
    <>
      <div className="explorer-controls">
        <label className="search-box"><span aria-hidden="true">⌕</span><span className="sr-only">Search skills</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “design” or “data”" /></label>
        <label className="select-label"><span className="sr-only">Filter by area</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option>All areas</option>{Array.from(new Set([...categories.map((item) => item.name), ...items.map((item) => item.category)])).map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="select-label"><span className="sr-only">Filter by level</span><select value={level} onChange={(event) => setLevel(event.target.value)}><option>All levels</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
        <label className="select-label"><span className="sr-only">Sort skills</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option>Recommended</option><option>A–Z</option></select></label>
      </div>
      <p className="result-count" aria-live="polite">{results.length} {results.length === 1 ? "skill" : "skills"} to explore</p>
      {results.length ? <div className="card-grid skill-grid">{results.map((skill) => <Link className="skill-card" href={`/skills/${skill.slug}`} key={skill.slug}>
        <div className={`icon-tile ${skill.color}`} aria-hidden="true">{skill.icon}</div>
        <span className="card-eyebrow">{skill.category}</span><h2>{skill.title}</h2><p>{skill.description}</p>
        <div className="card-meta"><span>{skill.level}</span><span>{skill.commitment}</span></div><span className="card-arrow" aria-hidden="true">↗</span>
      </Link>)}</div> : <div className="empty-state"><span aria-hidden="true">⌕</span><h2>No matches just yet</h2><p>Try another search or clear one of the filters.</p><button className="button button-quiet" type="button" onClick={() => { setQuery(""); setCategory("All areas"); setLevel("All levels"); }}>Clear filters</button></div>}
    </>
  );
}
