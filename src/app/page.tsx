import Link from "next/link";
import { ArrowRight, CheckCircle2, ExternalLink, Search, ShieldCheck } from "lucide-react";
import { DepartmentCard } from "@/components/department-card";
import { ProjectCard } from "@/components/project-card";
import { departments, projects } from "@/lib/catalog";

const licenseGuide = [
  { title: "Permissive", summary: "MIT, Apache, and BSD licenses are the simplest foundation for commercial delivery. Keep the required notices." },
  { title: "Weak copyleft", summary: "LGPL, MPL, and EPL keep covered components or files open while allowing separate surrounding systems." },
  { title: "Copyleft", summary: "GPL projects are commercially usable, but distribution of covered derivatives carries source-sharing duties." },
  { title: "Network copyleft", summary: "AGPL adds source-offer duties for users interacting with a modified version over a network." },
];

export default function HomePage() {
  const featured = projects.filter((project) => project.featured).slice(0, 6);
  const greekCount = projects.filter((project) => project.greekSupport === "verified").length;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "OpenSource for Business",
    description: "A curated catalog of open-source enterprise software.",
    numberOfItems: projects.length,
  };

  return (
    <main id="main-content" tabIndex={-1}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="hero">
        <div className="shell hero-grid">
          <div>
            <span className="kicker">Enterprise software, without the lock-in</span>
            <h1>Find software.<br />Build the <em>service.</em></h1>
            <p className="hero-copy">
              A sales-ready catalog of open-source tools you can deploy, adapt, integrate, support, and operate for real businesses.
            </p>
            <form className="hero-search" action="/catalog/" method="get">
              <label>
                <Search size={19} aria-hidden="true" />
                <span className="sr-only">Search the catalog</span>
                <input name="q" type="search" placeholder="Try “CRM”, “Greek UI”, or “network copyleft”…" />
              </label>
              <button className="primary-button" type="submit">Explore catalog <ArrowRight size={16} /></button>
            </form>
            <div className="hero-proof">
              <span><CheckCircle2 size={15} /> OSI-approved editions</span>
              <span><CheckCircle2 size={15} /> Buyer and service profiles</span>
              <span><CheckCircle2 size={15} /> License obligations surfaced</span>
            </div>
          </div>

          <aside className="hero-panel" aria-label="Catalog snapshot">
            <div className="hero-panel-header"><span>Catalog snapshot</span><span className="live-dot" /></div>
            <div className="hero-stat">
              <div><strong>{projects.length}</strong><span>Curated projects</span></div>
              <div><strong>{departments.length}</strong><span>Business departments</span></div>
              <div><strong>{greekCount}</strong><span>Verified Greek locales</span></div>
              <div><strong>4</strong><span>License families</span></div>
            </div>
            <div className="hero-panel-list">
              {projects.filter((project) => ["erpnext", "twenty", "metabase", "keycloak"].includes(project.slug)).map((project) => (
                <Link key={project.slug} href={`/projects/${project.slug}/`}>
                  <div><strong>{project.name}</strong><span>{project.categories[0]?.name}</span></div>
                  <ArrowRight size={16} />
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="section" id="departments">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="kicker">Start with the buyer</span>
              <h2>Explore by business department.</h2>
              <p>Each department is organized around software categories a real budget owner can recognize and purchase services for.</p>
            </div>
            <Link className="text-link" href="/catalog/">Browse all {projects.length} projects <ArrowRight size={16} /></Link>
          </div>
          <div className="department-grid">
            {departments.map((department, index) => <DepartmentCard key={department.id} department={department} index={index} />)}
          </div>
        </div>
      </section>

      <section className="section featured-section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="kicker">Strong opening conversations</span>
              <h2>Enterprise-ready anchors.</h2>
              <p>Recognizable communities, credible deployment paths, and a clear reason for a company to pay for implementation and support.</p>
            </div>
            <Link className="text-link" href="/catalog/?maturity=anchor">View all anchors <ArrowRight size={16} /></Link>
          </div>
          <div className="project-grid">
            {featured.map((project) => <ProjectCard key={project.slug} project={project} />)}
          </div>
        </div>
      </section>

      <section className="section license-section" id="licenses">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="kicker">Commercial does not mean proprietary</span>
              <h2>Know what the license asks of you.</h2>
              <p>Every profile separates product opportunity from license obligations and open-core edition boundaries.</p>
            </div>
            <a className="text-link" href="https://opensource.org/faq" target="_blank" rel="noreferrer">Read OSI guidance <ExternalLink size={15} /></a>
          </div>
          <div className="license-grid">
            {licenseGuide.map((item, index) => (
              <article className="license-card" key={item.title}>
                <div className="license-index"><span>0{index + 1}</span><span className="license-swatch" /></div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </article>
            ))}
          </div>
          <div className="legal-note"><ShieldCheck size={20} /><span>These summaries help scope a commercial conversation; they are not a substitute for legal review of the exact version, modifications, distribution model, and trademarks.</span></div>
        </div>
      </section>
    </main>
  );
}
