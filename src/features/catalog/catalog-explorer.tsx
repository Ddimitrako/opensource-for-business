"use client";

import Fuse from "fuse.js";
import { Grid2X2, List, Search, SearchX, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useTransition } from "react";
import { ProjectCard } from "@/components/project-card";
import { departments, projects } from "@/lib/catalog";
import { filterProjects, searchableProject, type CatalogFilters } from "@/lib/filtering";
import type { CompanySize, DeploymentMode, LicenseFamily, Maturity, ServiceType } from "@/lib/schemas";

const companySizes: CompanySize[] = ["Small business", "Mid-market", "Enterprise"];
const maturities: { value: Maturity; label: string }[] = [
  { value: "anchor", label: "Anchor" },
  { value: "established", label: "Established" },
  { value: "niche-leader", label: "Niche leader" },
];
const licenseFamilies: { value: LicenseFamily; label: string }[] = [
  { value: "permissive", label: "Permissive" },
  { value: "weak-copyleft", label: "Weak copyleft" },
  { value: "copyleft", label: "Copyleft" },
  { value: "network-copyleft", label: "Network copyleft" },
];
const deployments: DeploymentMode[] = ["Docker", "Kubernetes", "Manual", "Desktop"];
const services: ServiceType[] = ["Deployment", "Migration", "Integration", "Customization", "Training", "Support", "Managed hosting", "Security hardening", "Data services"];
const searchableProjects = projects.map((project) => ({ ...project, searchText: searchableProject(project) }));

export function CatalogExplorer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const query = searchParams.get("q") ?? "";
  const view = searchParams.get("view") === "list" ? "list" : "grid";
  const selectedDepartment = searchParams.get("department") ?? "";

  const filters: CatalogFilters = {
    department: selectedDepartment || undefined,
    category: searchParams.get("category") || undefined,
    companySize: (searchParams.get("companySize") || undefined) as CompanySize | undefined,
    maturity: (searchParams.get("maturity") || undefined) as Maturity | undefined,
    licenseFamily: (searchParams.get("license") || undefined) as LicenseFamily | undefined,
    deployment: (searchParams.get("deployment") || undefined) as DeploymentMode | undefined,
    greek: searchParams.get("greek") === "verified" ? "verified" : undefined,
    service: (searchParams.get("service") || undefined) as ServiceType | undefined,
  };

  const fuse = useMemo(() => new Fuse(searchableProjects, {
    threshold: 0.33,
    ignoreLocation: true,
    includeScore: true,
    keys: [
      { name: "name", weight: 3 },
      { name: "summary", weight: 1.6 },
      { name: "problem", weight: 1.1 },
      { name: "categories.name", weight: 2 },
      { name: "departments.name", weight: 1.5 },
      { name: "buyerRoles", weight: 1 },
      { name: "serviceTypes", weight: .7 },
      { name: "license.spdx", weight: 1 },
      { name: "searchText", weight: 1.4 },
    ],
  }), []);

  const searched = query.trim() ? fuse.search(query.trim()).map((match) => match.item) : projects;
  const result = filterProjects(searched, filters);

  const categoryOptions = selectedDepartment
    ? departments.find((department) => department.id === selectedDepartment)?.categories ?? []
    : departments.flatMap((department) => department.categories);

  function updateParam(key: string, value?: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key === "department") params.delete("category");
    startTransition(() => router.replace(`/catalog/${params.size ? `?${params}` : ""}`, { scroll: false }));
  }

  function clearAll() {
    startTransition(() => router.replace("/catalog/", { scroll: false }));
  }

  const activeEntries = [
    ["department", departments.find((item) => item.id === filters.department)?.shortName],
    ["category", categoryOptions.find((item) => item.id === filters.category)?.name],
    ["companySize", filters.companySize], ["maturity", filters.maturity], ["license", filters.licenseFamily],
    ["deployment", filters.deployment], ["greek", filters.greek ? "Greek UI" : undefined], ["service", filters.service],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));

  return (
    <div className="catalog-layout">
      <aside className="filter-sidebar" aria-label="Catalog filters">
        <div className="filter-sidebar-header"><strong>Refine catalog</strong><button className="clear-button" type="button" onClick={clearAll}>Clear all</button></div>
        <FilterSelect label="Department" value={selectedDepartment} onChange={(value) => updateParam("department", value)} options={departments.map((item) => ({ value: item.id, label: item.shortName }))} />
        <FilterSelect label="Category" value={filters.category ?? ""} onChange={(value) => updateParam("category", value)} options={categoryOptions.map((item) => ({ value: item.id, label: item.name }))} />
        <FilterSelect label="Company size" value={filters.companySize ?? ""} onChange={(value) => updateParam("companySize", value)} options={companySizes.map((item) => ({ value: item, label: item }))} />
        <FilterSelect label="Maturity" value={filters.maturity ?? ""} onChange={(value) => updateParam("maturity", value)} options={maturities} />
        <FilterSelect label="License family" value={filters.licenseFamily ?? ""} onChange={(value) => updateParam("license", value)} options={licenseFamilies} />
        <FilterSelect label="Deployment" value={filters.deployment ?? ""} onChange={(value) => updateParam("deployment", value)} options={deployments.map((item) => ({ value: item, label: item }))} />
        <FilterSelect label="Service opportunity" value={filters.service ?? ""} onChange={(value) => updateParam("service", value)} options={services.map((item) => ({ value: item, label: item }))} />
        <div className="filter-group">
          <label>Language</label>
          <button type="button" className="greek-toggle" aria-pressed={filters.greek === "verified"} onClick={() => updateParam("greek", filters.greek ? undefined : "verified")}>
            <span>Verified Greek UI</span><span aria-hidden="true" />
          </button>
        </div>
      </aside>

      <div>
        <div className="catalog-toolbar">
          <label className="search-control">
            <Search size={17} aria-hidden="true" />
            <span className="sr-only">Search projects</span>
            <input value={query} onChange={(event) => updateParam("q", event.target.value)} type="search" placeholder="Search names, use cases, categories…" />
          </label>
          <span className="catalog-count" aria-live="polite">{result.length} of {projects.length}</span>
          <div className="view-toggle" aria-label="Catalog view">
            <button className={view === "grid" ? "is-active" : ""} type="button" onClick={() => updateParam("view", "grid")} aria-label="Grid view" aria-pressed={view === "grid"}><Grid2X2 size={16} /></button>
            <button className={view === "list" ? "is-active" : ""} type="button" onClick={() => updateParam("view", "list")} aria-label="List view" aria-pressed={view === "list"}><List size={17} /></button>
          </div>
        </div>

        {activeEntries.length > 0 && (
          <div className="active-filters" aria-label="Active filters">
            {activeEntries.map(([key, label]) => <span className="active-filter" key={key}>{label}<button type="button" onClick={() => updateParam(key)} aria-label={`Remove ${label} filter`}><X size={12} /></button></span>)}
          </div>
        )}

        {result.length ? (
          <div className={`project-grid ${view === "list" ? "list-view" : ""}`}>
            {result.map((project) => <ProjectCard key={project.slug} project={project} view={view} />)}
          </div>
        ) : (
          <div className="empty-state">
            <SearchX size={32} />
            <h2>No matching projects</h2>
            <p>Try removing a filter or using a broader search term.</p>
            <button className="secondary-button" type="button" onClick={clearAll}>Reset catalog</button>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void }) {
  const id = `filter-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className="filter-group">
      <label htmlFor={id}>{label}</label>
      <select id={id} className="select-control" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">All</option>
        {options.map((option) => <option key={`${label}-${option.value}`} value={option.value}>{option.label}</option>)}
      </select>
    </div>
  );
}
