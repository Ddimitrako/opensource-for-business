import Link from "next/link";
import { ArrowUpRight, Languages, Star } from "lucide-react";
import { ShortlistButton } from "@/features/shortlist/shortlist-button";
import { formatStars, licenseFamilyLabel, maturityLabel, type Project } from "@/lib/catalog";
import { cn, initials } from "@/lib/utils";

export function ProjectCard({ project, view = "grid" }: { project: Project; view?: "grid" | "list" }) {
  const stars = formatStars(project.snapshot?.stars);
  return (
    <article className={cn("project-card", view === "list" && "project-card-list")} data-testid="project-card">
      <div className="project-card-header">
        <span className="project-monogram" aria-hidden="true">{initials(project.name)}</span>
        <ShortlistButton slug={project.slug} name={project.name} />
      </div>

      <div className="project-card-body">
        <div className="eyebrow-row">
          <span className={`maturity maturity-${project.maturity}`}>{maturityLabel(project.maturity)}</span>
          {project.greekSupport === "verified" && <span className="greek-badge"><Languages size={13} /> Greek UI</span>}
        </div>
        <h3><Link href={`/projects/${project.slug}/`}>{project.name}</Link></h3>
        <p>{project.summary}</p>
      </div>

      <div className="project-card-footer">
        <div className="tag-row">
          <span>{project.license.spdx}</span>
          <span>{licenseFamilyLabel(project.license.family)}</span>
          {stars && <span><Star size={12} fill="currentColor" /> {stars}</span>}
        </div>
        <Link href={`/projects/${project.slug}/`} className="project-open" aria-label={`View ${project.name} profile`}>
          Profile <ArrowUpRight size={15} />
        </Link>
      </div>
    </article>
  );
}

