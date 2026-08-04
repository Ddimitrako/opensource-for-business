import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ShortlistView } from "@/features/shortlist/shortlist-view";

export const metadata: Metadata = {
  title: "Shortlist",
  description: "Your locally saved open-source business software shortlist.",
};

export default function ShortlistPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="page-hero">
        <div className="shell">
          <Breadcrumbs items={[{ label: "Shortlist" }]} />
          <span className="kicker">Decision workspace</span>
          <h1>Your shortlist</h1>
          <p>Keep the strongest candidates together before moving into technical discovery and commercial scoping.</p>
        </div>
      </section>
      <section className="section">
        <div className="shell"><ShortlistView /></div>
      </section>
    </main>
  );
}
