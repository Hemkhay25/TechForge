"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/skills", label: "Explore skills" },
  { href: "/paths", label: "Learning paths" },
  { href: "/projects", label: "Projects" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link href="/" className="brand" aria-label="TechForge home" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>tech<span className="brand-light">forge</span></span>
        </Link>
        <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen(!open)}>
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span /><span />
        </button>
        <nav id="primary-nav" className={`primary-nav${open ? " is-open" : ""}`} aria-label="Primary navigation">
          {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}
          <Link className="nav-login" href="/login" onClick={() => setOpen(false)}>Log in</Link>
          <Link className="button button-small" href="/register" onClick={() => setOpen(false)}>Get started <span aria-hidden="true">↗</span></Link>
        </nav>
      </div>
    </header>
  );
}
