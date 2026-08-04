import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DepartmentIcon } from "@/components/department-icon";
import { getProjectsForDepartment } from "@/lib/catalog";
import type { Department } from "@/lib/schemas";

export function DepartmentCard({ department, index }: { department: Department; index: number }) {
  const count = getProjectsForDepartment(department.id).length;
  return (
    <Link href={`/departments/${department.id}/`} className="department-card" style={{ "--card-index": index } as React.CSSProperties}>
      <div className="department-card-top">
        <span className="department-icon"><DepartmentIcon icon={department.icon} /></span>
        <ArrowUpRight size={20} aria-hidden="true" />
      </div>
      <h3>{department.name}</h3>
      <p>{department.description}</p>
      <div className="department-card-meta">
        <span>{count} projects</span>
        <span>{department.categories.length} categories</span>
      </div>
    </Link>
  );
}
