import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CatalogExplorer } from "@/features/catalog/catalog-explorer";
import { projects } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Enterprise open-source catalog",
  description: "Search and filter curated open-source enterprise software by department, buyer, license, deployment, maturity, and service opportunity.",
};

export default function CatalogPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="page-hero">
        <div className="shell">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Catalog" }]} />
          <div className="page-hero-grid">
            <div><span className="kicker">Curated, not scraped</span><h1>Enterprise open-source catalog.</h1><p>Filter by buyer, maturity, license obligations, deployment model, Greek support, and the services you can sell around each product.</p></div>
            <div className="page-hero-stat"><strong>{projects.length}</strong><span>Verified profiles</span></div>
          </div>
        </div>
      </section>
      <section className="section-tight">
        <div className="shell">
          <h2 className="sr-only">Catalog results</h2>
          <Suspense fallback={<div className="empty-state"><p>Loading catalog…</p></div>}><CatalogExplorer /></Suspense>
        </div>
      </section>
    </main>
  );
}
