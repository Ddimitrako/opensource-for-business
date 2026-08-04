import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ComparisonView } from "@/features/compare/comparison-view";

export const metadata: Metadata = {
  title: "Compare projects",
  description: "Compare open-source business products across commercial and technical criteria.",
};

export default function ComparePage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="page-hero">
        <div className="shell">
          <Breadcrumbs items={[{ label: "Compare" }]} />
          <span className="kicker">Decision support</span>
          <h1>Compare the shortlist</h1>
          <p>Put licensing, deployment, business fit, language coverage, and sellable services on one page.</p>
        </div>
      </section>
      <section className="section">
        <div className="shell">
          <Suspense fallback={<div className="empty-state">Loading comparison…</div>}><ComparisonView /></Suspense>
        </div>
      </section>
    </main>
  );
}
