"use client";

import Link from "next/link";
import { Menu, Scale, X } from "lucide-react";
import { useState } from "react";
import { useShortlist } from "@/features/shortlist/use-shortlist";

const navigation = [
  { href: "/catalog/", label: "Catalog" },
  { href: "/#departments", label: "Departments" },
  { href: "/#licenses", label: "License guide" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const shortlist = useShortlist();

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label="OpenSource for Business home">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>OpenSource<span>for Business</span></span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>

        <div className="header-actions">
          <Link href="/shortlist/" className="shortlist-link" aria-label={`Shortlist, ${shortlist.count} saved projects`}>
            <Scale size={17} aria-hidden="true" />
            <span>Shortlist</span>
            <span className="shortlist-count" aria-label={`${shortlist.count} shortlisted projects`}>{shortlist.count}</span>
          </Link>
          <button
            className="mobile-menu-button"
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close navigation" : "Open navigation"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
          ))}
          <Link href="/shortlist/" onClick={() => setOpen(false)}>Shortlist ({shortlist.count})</Link>
        </nav>
      )}
    </header>
  );
}
