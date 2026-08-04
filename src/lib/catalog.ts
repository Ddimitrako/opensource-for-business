import departmentsJson from "@/data/departments.json";
import licensesJson from "@/data/licenses.json";
import projectsJson from "@/data/projects.json";
import snapshotsJson from "@/data/repo-snapshots.json";
import {
  departmentSchema,
  licenseProfileSchema,
  projectSeedSchema,
  repoSnapshotSchema,
  type Category,
  type Department,
  type LicenseProfile,
  type ProjectSeed,
  type RepoSnapshot,
} from "@/lib/schemas";

export type ProjectCategory = Category & { departmentId: string; departmentName: string };

export type Project = ProjectSeed & {
  license: LicenseProfile;
  snapshot?: RepoSnapshot;
  departments: Department[];
  categories: ProjectCategory[];
};

export const departments = departmentSchema.array().length(8).parse(departmentsJson);
export const licenses = licenseProfileSchema.array().parse(licensesJson);
const projectSeeds = projectSeedSchema.array().min(60).max(65).parse(projectsJson);
const repoSnapshots = repoSnapshotSchema.array().parse(snapshotsJson);

const licenseMap = new Map(licenses.map((license) => [license.id, license]));
const departmentMap = new Map(departments.map((department) => [department.id, department]));
const categoryMap = new Map(
  departments.flatMap((department) =>
    department.categories.map((category) => [
      category.id,
      { ...category, departmentId: department.id, departmentName: department.name },
    ] as const),
  ),
);
const snapshotMap = new Map(repoSnapshots.map((snapshot) => [snapshot.slug, snapshot]));

const seenSlugs = new Set<string>();

export const projects: Project[] = projectSeeds.map((seed) => {
  if (seenSlugs.has(seed.slug)) throw new Error(`Duplicate project slug: ${seed.slug}`);
  seenSlugs.add(seed.slug);

  const license = licenseMap.get(seed.licenseId);
  if (!license) throw new Error(`Unknown license '${seed.licenseId}' on ${seed.slug}`);

  const projectDepartments = seed.departmentIds.map((id) => {
    const department = departmentMap.get(id);
    if (!department) throw new Error(`Unknown department '${id}' on ${seed.slug}`);
    return department;
  });

  const projectCategories = seed.categoryIds.map((id) => {
    const category = categoryMap.get(id);
    if (!category) throw new Error(`Unknown category '${id}' on ${seed.slug}`);
    return category;
  });

  const validDepartmentIds = new Set(projectDepartments.map((department) => department.id));
  for (const category of projectCategories) {
    if (!validDepartmentIds.has(category.departmentId)) {
      throw new Error(`Category '${category.id}' is outside the departments declared on ${seed.slug}`);
    }
  }

  return {
    ...seed,
    license,
    snapshot: snapshotMap.get(seed.slug),
    departments: projectDepartments,
    categories: projectCategories,
  };
}).sort((a, b) => b.editorialScore - a.editorialScore || a.name.localeCompare(b.name));

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getDepartment(id: string) {
  return departments.find((department) => department.id === id);
}

export function getProjectsForDepartment(id: string) {
  return projects.filter((project) => project.departmentIds.includes(id));
}

export function getProjectsForCategory(id: string) {
  return projects.filter((project) => project.categoryIds.includes(id));
}

export function getCategory(id: string) {
  return categoryMap.get(id);
}

export function formatStars(stars: number | null | undefined) {
  if (stars == null) return null;
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(stars);
}

export function maturityLabel(maturity: Project["maturity"]) {
  return maturity === "niche-leader"
    ? "Niche leader"
    : maturity.charAt(0).toUpperCase() + maturity.slice(1);
}

export function licenseFamilyLabel(family: Project["license"]["family"]) {
  const labels = {
    permissive: "Permissive",
    "weak-copyleft": "Weak copyleft",
    copyleft: "Copyleft",
    "network-copyleft": "Network copyleft",
  } as const;
  return labels[family];
}

export function repositoryPath(repository: string) {
  return repository.replace("https://github.com/", "").replace(/\/$/, "");
}

