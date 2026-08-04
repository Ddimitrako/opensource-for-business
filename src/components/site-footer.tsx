import Link from "next/link";
import { Github } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <div className="brand footer-brand">
            <span className="brand-mark" aria-hidden="true"><span /></span>
            <span>OpenSource<span>for Business</span></span>
          </div>
          <p>Curated enterprise software you can deploy, adapt, support, and build services around.</p>
        </div>
        <div>
          <strong>Explore</strong>
          <Link href="/catalog/">Full catalog</Link>
          <Link href="/shortlist/">Your shortlist</Link>
          <Link href="/#licenses">License guide</Link>
        </div>
        <div>
          <strong>Principles</strong>
          <a href="https://opensource.org/faq" target="_blank" rel="noreferrer">OSI commercial-use guidance</a>
          <a href="https://github.com/" target="_blank" rel="noreferrer"><Github size={15} /> Repository evidence</a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>Catalog snapshot: August 2026</span>
        <span>License summaries are informational, not legal advice.</span>
      </div>
    </footer>
  );
}

