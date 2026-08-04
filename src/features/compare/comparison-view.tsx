"use client";

import Link from "next/link";
import { ArrowRight, GitCompareArrows, Languages, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { licenseFamilyLabel, maturityLabel, projects } from "@/lib/catalog";
import { initials } from "@/lib/utils";

function list(values: string[]) {
  return <ul className="compare-list">{values.map((value) => <li key={value}>{value}</li>)}</ul>;
}

export function ComparisonView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const requested = (searchParams.get("projects") ?? "").split(",").filter(Boolean);
  const compared = [...new Set(requested)]
    .slice(0, 4)
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is (typeof projects)[number] => Boolean(project));

  function remove(slug: string) {
    const next = compared.filter((project) => project.slug !== slug).map((project) => project.slug);
    router.replace(next.length ? `${pathname}?projects=${next.join(",")}` : pathname, { scroll: false });
  }

  if (compared.length === 0) {
    return (
      <div className="empty-state">
        <GitCompareArrows size={36} />
        <h2>Choose products to compare</h2>
        <p>Open any product profile or use your shortlist to build a comparison of up to four tools.</p>
        <Link className="primary-button" href="/catalog/">Browse products <ArrowRight size={16} /></Link>
      </div>
    );
  }

  const rows = [
    { label: "Business fit", render: (index: number) => <p className="compare-value">{compared[index].idealFor}</p> },
    { label: "Departments", render: (index: number) => list(compared[index].departments.map((item) => item.name)) },
    { label: "Categories", render: (index: number) => list(compared[index].categories.map((item) => item.name)) },
    { label: "Company size", render: (index: number) => list(compared[index].companySizes) },
    { label: "Maturity", render: (index: number) => <span className={`maturity maturity-${compared[index].maturity}`}>{maturityLabel(compared[index].maturity)}</span> },
    { label: "License", render: (index: number) => <p className="compare-value"><strong>{compared[index].license.spdx}</strong><br />{licenseFamilyLabel(compared[index].license.family)}</p> },
    { label: "Deployment", render: (index: number) => list(compared[index].deploymentModes) },
    { label: "Greek", render: (index: number) => <p className="compare-value"><Languages size={14} /> {compared[index].greekSupport}</p> },
    { label: "Services", render: (index: number) => list(compared[index].serviceTypes) },
    { label: "Edition boundary", render: (index: number) => <p className="compare-value">{compared[index].editionBoundary ?? "No separate commercial edition noted in this catalog."}</p> },
  ];

  return (
    <>
      <p className="comparison-summary">Comparing {compared.length} of 4 possible projects. This URL can be copied and shared.</p>
      <div className="compare-shell">
        <div className="compare-table" style={{ "--compare-count": compared.length } as React.CSSProperties}>
          <div className="compare-row">
            <div className="compare-label">Product</div>
            {compared.map((project) => (
              <div className="compare-project-head" key={project.slug}>
                <button className="compare-remove" type="button" aria-label={`Remove ${project.name}`} onClick={() => remove(project.slug)}><X size={15} /></button>
                <span className="project-monogram" aria-hidden="true">{initials(project.name)}</span>
                <h3><Link href={`/projects/${project.slug}/`}>{project.name}</Link></h3>
                <p>{project.edition}</p>
              </div>
            ))}
          </div>
          {rows.map((row) => (
            <div className="compare-row" key={row.label}>
              <div className="compare-label">{row.label}</div>
              {compared.map((project, index) => <div key={project.slug}>{row.render(index)}</div>)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
