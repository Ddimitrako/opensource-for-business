import type {
  CompanySize,
  DeploymentMode,
  LicenseFamily,
  Maturity,
  ServiceType,
} from "@/lib/schemas";
import type { Project } from "@/lib/catalog";

export type CatalogFilters = {
  department?: string;
  category?: string;
  companySize?: CompanySize;
  maturity?: Maturity;
  licenseFamily?: LicenseFamily;
  deployment?: DeploymentMode;
  greek?: "verified";
  service?: ServiceType;
};

export function filterProjects(items: Project[], filters: CatalogFilters) {
  return items.filter((project) => {
    if (filters.department && !project.departmentIds.includes(filters.department)) return false;
    if (filters.category && !project.categoryIds.includes(filters.category)) return false;
    if (filters.companySize && !project.companySizes.includes(filters.companySize)) return false;
    if (filters.maturity && project.maturity !== filters.maturity) return false;
    if (filters.licenseFamily && project.license.family !== filters.licenseFamily) return false;
    if (filters.deployment && !project.deploymentModes.includes(filters.deployment)) return false;
    if (filters.greek && project.greekSupport !== "verified") return false;
    if (filters.service && !project.serviceTypes.includes(filters.service)) return false;
    return true;
  });
}

export function searchableProject(project: Project) {
  return [
    project.name,
    project.edition,
    project.summary,
    project.problem,
    project.idealFor,
    ...project.departments.map((department) => department.name),
    ...project.categories.map((category) => category.name),
    ...project.buyerRoles,
    ...project.companySizes,
    ...project.deploymentModes,
    ...project.serviceTypes,
    project.maturity.replace("-", " "),
    project.license.spdx,
    project.license.family.replace("-", " "),
    project.greekSupport === "verified" ? "Greek UI verified Greek locale" : "",
    project.greekSupport === "partial" ? "partial Greek locale" : "",
  ].join(" ");
}
