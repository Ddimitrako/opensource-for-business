import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, Github, Languages, Scale, Server } from "lucide-react";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ShortlistButton } from "@/features/shortlist/shortlist-button";
import {
  formatStars,
  getProject,
  licenseFamilyLabel,
  maturityLabel,
  projects,
  repositoryPath,
} from "@/lib/catalog";
import { initials } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.name} — business profile`,
    description: project.summary,
  };
}

function greekLabel(status: (typeof projects)[number]["greekSupport"]) {
  const labels = {
    verified: "Verified Greek UI",
    partial: "Partial Greek support",
    unavailable: "Greek unavailable",
    unknown: "Greek support unknown",
  } as const;
  return labels[status];
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const stars = formatStars(project.snapshot?.stars);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.name,
    applicationCategory: project.categories[0]?.name,
    operatingSystem: "Self-hosted",
    url: project.website,
    codeRepository: project.repository,
    license: project.license.evidence,
    description: project.summary,
  };

  return (
    <main id="main-content" tabIndex={-1}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="project-hero">
        <div className="shell">
          <Breadcrumbs items={[
            { label: "Catalog", href: "/catalog/" },
            { label: project.departments[0].shortName, href: `/departments/${project.departments[0].id}/` },
            { label: project.name },
          ]} />
          <div className="project-hero-grid">
            <div>
              <div className="project-title-row">
                <span className="project-monogram" aria-hidden="true">{initials(project.name)}</span>
                <div>
                  <h1>{project.name}</h1>
                  <p className="project-edition">{project.edition}</p>
                </div>
              </div>
              <p className="project-lead">{project.summary}</p>
              <div className="project-hero-tags">
                <span>{maturityLabel(project.maturity)}</span>
                <span>{project.license.spdx}</span>
                <span>{licenseFamilyLabel(project.license.family)}</span>
                <span><Languages size={13} /> {greekLabel(project.greekSupport)}</span>
                {stars && <span>★ {stars} GitHub stars</span>}
              </div>
            </div>
            <aside className="project-actions" aria-label="Project actions">
              <a className="primary-button" href={project.website} target="_blank" rel="noreferrer">
                Official website <ArrowUpRight size={16} />
              </a>
              <a className="secondary-button" href={project.repository} target="_blank" rel="noreferrer">
                <Github size={16} /> GitHub repository
              </a>
              <ShortlistButton slug={project.slug} name={project.name} withLabel />
            </aside>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell project-layout">
          <div>
            <section className="content-block">
              <span className="kicker">Business fit</span>
              <h2>Problem it solves</h2>
              <p>{project.problem}</p>
            </section>
            <section className="content-block">
              <h2>Ideal buyer</h2>
              <p>{project.idealFor}</p>
              <div className="info-pills" style={{ marginTop: 16 }}>
                {project.buyerRoles.map((role) => <span key={role}>{role}</span>)}
                {project.companySizes.map((size) => <span key={size}>{size}</span>)}
              </div>
            </section>
            <section className="content-block">
              <h2>Commercial service opportunities</h2>
              <p>The software is open source; the sellable offer is the expertise and operating outcome around it.</p>
              <div className="offer-grid" style={{ marginTop: 18 }}>
                {project.serviceTypes.map((service) => (
                  <div className="offer-item" key={service}><Check size={16} /> {service}</div>
                ))}
              </div>
            </section>
            <section className="content-block">
              <h2>Deployment options</h2>
              <div className="info-pills">
                {project.deploymentModes.map((mode) => <span key={mode}><Server size={13} /> {mode}</span>)}
              </div>
            </section>
            {project.editionBoundary && (
              <section className="content-block">
                <h2>Edition boundary</h2>
                <div className="edition-note"><Scale size={18} /> <span>{project.editionBoundary}</span></div>
              </section>
            )}
          </div>

          <aside className="detail-sidebar">
            <section className="detail-card">
              <h3>Editorial snapshot</h3>
              <dl className="detail-list">
                <div><dt>Maturity</dt><dd>{maturityLabel(project.maturity)}</dd></div>
                <div><dt>Edition</dt><dd>{project.edition}</dd></div>
                <div><dt>Repository</dt><dd>{repositoryPath(project.repository)}</dd></div>
                <div><dt>Verified</dt><dd>{project.lastVerifiedAt}</dd></div>
                <div><dt>English</dt><dd>Verified</dd></div>
                <div><dt>Greek</dt><dd>{greekLabel(project.greekSupport)}</dd></div>
              </dl>
              {project.greekEvidence && (
                <a className="text-link" href={project.greekEvidence} target="_blank" rel="noreferrer" style={{ marginTop: 14 }}>
                  Locale evidence <ArrowUpRight size={14} />
                </a>
              )}
            </section>
            <section className="detail-card license-callout">
              <span className="license-family">{licenseFamilyLabel(project.license.family)}</span>
              <h3 style={{ marginTop: 10 }}>{project.license.name}</h3>
              <p>{project.license.summary}</p>
              <ul className="obligation-list">
                {project.license.obligations.map((obligation) => <li key={obligation}>{obligation}</li>)}
              </ul>
              <a className="text-link" href={project.license.evidence} target="_blank" rel="noreferrer" style={{ marginTop: 14 }}>
                License evidence <ArrowUpRight size={14} />
              </a>
            </section>
            <p className="legal-note">License summaries are operational guidance, not legal advice. Review your exact distribution and hosting model with counsel.</p>
          </aside>
        </div>
      </section>

      <section className="section-tight license-section">
        <div className="narrow-shell callout-panel">
          <span className="kicker">Next step</span>
          <h2>Compare the implementation fit</h2>
          <p>Add up to four projects to a shareable comparison, or continue exploring the buyer category.</p>
          <div className="button-row">
            <Link className="primary-button" href={`/compare/?projects=${project.slug}`}>Start comparison</Link>
            <Link className="secondary-button" href={`/catalog/?category=${project.categoryIds[0]}`}>Similar products</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
