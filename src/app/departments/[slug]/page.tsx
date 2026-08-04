import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { DepartmentIcon } from "@/components/department-icon";
import { ProjectCard } from "@/components/project-card";
import {
  departments,
  getDepartment,
  getProjectsForCategory,
  getProjectsForDepartment,
} from "@/lib/catalog";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return departments.map((department) => ({ slug: department.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const department = getDepartment(slug);
  if (!department) return {};
  return {
    title: `${department.name} open-source software`,
    description: `Curated open-source products for ${department.name.toLowerCase()} teams: ${department.categories.map((category) => category.name).join(", ")}.`,
  };
}

export default async function DepartmentPage({ params }: PageProps) {
  const { slug } = await params;
  const department = getDepartment(slug);
  if (!department) notFound();
  const departmentProjects = getProjectsForDepartment(department.id);

  return (
    <main id="main-content" tabIndex={-1}>
      <section className="page-hero">
        <div className="shell">
          <Breadcrumbs items={[{ label: "Departments", href: "/#departments" }, { label: department.name }]} />
          <div className="page-hero-grid">
            <div>
              <div className="department-intro">
                <span className="department-icon"><DepartmentIcon icon={department.icon} /></span>
                <span className="kicker">Buyer department</span>
              </div>
              <h1>{department.name}</h1>
              <p>{department.description}</p>
              <Link className="text-link" href={`/catalog/?department=${department.id}`}>
                Open filtered catalog <ArrowRight size={16} />
              </Link>
            </div>
            <div className="page-hero-stat" aria-label={`${departmentProjects.length} projects in ${department.categories.length} categories`}>
              <strong>{departmentProjects.length}</strong>
              <span>curated projects</span>
              <small>{department.categories.length} buying categories</small>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          {department.categories.map((category) => {
            const categoryProjects = getProjectsForCategory(category.id);
            return (
              <section className="category-section" id={category.id} key={category.id}>
                <div className="category-heading">
                  <div>
                    <h2>{category.name}</h2>
                    <p>{category.description}</p>
                  </div>
                  <span>{categoryProjects.length} {categoryProjects.length === 1 ? "option" : "options"}</span>
                </div>
                <div className="project-grid">
                  {categoryProjects.map((project) => <ProjectCard project={project} key={project.slug} />)}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}
