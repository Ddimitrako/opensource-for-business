import { describe, expect, it } from "vitest";
import { projects } from "@/lib/catalog";
import { filterProjects, searchableProject } from "@/lib/filtering";

describe("catalog filtering", () => {
  it("combines department, maturity, deployment, and service filters", () => {
    const result = filterProjects(projects, {
      department: "it-security",
      maturity: "anchor",
      deployment: "Docker",
      service: "Managed hosting",
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((project) => project.departmentIds.includes("it-security"))).toBe(true);
    expect(result.every((project) => project.maturity === "anchor")).toBe(true);
  });

  it("returns only verified Greek projects", () => {
    const result = filterProjects(projects, { greek: "verified" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((project) => project.greekSupport === "verified")).toBe(true);
  });

  it("classifies license families", () => {
    expect(filterProjects(projects, { licenseFamily: "network-copyleft" })).toEqual(
      expect.arrayContaining([expect.objectContaining({ slug: "grafana" })]),
    );
    expect(filterProjects(projects, { licenseFamily: "permissive" }).length).toBeGreaterThan(0);
  });

  it("builds a searchable document from buyer-facing fields", () => {
    const twenty = projects.find((project) => project.slug === "twenty");
    expect(twenty).toBeDefined();
    expect(searchableProject(twenty!)).toContain("CRM & Pipeline");
    expect(searchableProject(twenty!)).toContain("Sales");
    const odoo = projects.find((project) => project.slug === "odoo-community");
    expect(searchableProject(odoo!)).toContain("Greek UI");
    expect(searchableProject(twenty!)).toContain("network copyleft");
  });
});
