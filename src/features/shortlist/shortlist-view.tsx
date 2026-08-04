"use client";

import Link from "next/link";
import { ArrowRight, Heart, Trash2 } from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { useShortlist } from "@/features/shortlist/use-shortlist";
import { projects } from "@/lib/catalog";

export function ShortlistView() {
  const shortlist = useShortlist();
  const selected = shortlist.slugs
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is (typeof projects)[number] => Boolean(project));
  const compare = selected.slice(0, 4).map((project) => project.slug).join(",");

  if (selected.length === 0) {
    return (
      <div className="empty-state">
        <Heart size={34} aria-hidden="true" />
        <h2>Your shortlist is empty</h2>
        <p>Save products from the catalog to assemble a practical client proposal.</p>
        <Link className="primary-button" href="/catalog/">Explore the catalog <ArrowRight size={16} /></Link>
      </div>
    );
  }

  return (
    <>
      <div className="shortlist-header">
        <div>
          <h2>{selected.length} saved {selected.length === 1 ? "project" : "projects"}</h2>
          <p>Saved locally in this browser. Choose up to four for a side-by-side comparison.</p>
        </div>
        <div className="shortlist-actions">
          <button className="secondary-button" type="button" onClick={shortlist.clear}><Trash2 size={15} /> Clear</button>
          <Link className="primary-button" href={`/compare/?projects=${compare}`}>Compare {Math.min(selected.length, 4)} <ArrowRight size={15} /></Link>
        </div>
      </div>
      <div className="project-grid">
        {selected.map((project) => <ProjectCard project={project} key={project.slug} />)}
      </div>
    </>
  );
}
