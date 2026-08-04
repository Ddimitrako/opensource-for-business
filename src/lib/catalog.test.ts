import { describe, expect, it } from "vitest";
import { departments, licenses, projects } from "@/lib/catalog";

describe("catalog schema and editorial invariants", () => {
  it("contains exactly eight departments with no more than seven categories", () => {
    expect(departments).toHaveLength(8);
    expect(departments.every((department) => department.categories.length <= 7)).toBe(true);
  });

  it("contains 60–65 unique projects", () => {
    expect(projects.length).toBeGreaterThanOrEqual(60);
    expect(projects.length).toBeLessThanOrEqual(65);
    expect(new Set(projects.map((project) => project.slug)).size).toBe(projects.length);
  });

  it("keeps every catalog edition OSI-approved and documented", () => {
    expect(licenses.every((license) => license.osiApproved)).toBe(true);
    for (const project of projects) {
      expect(project.license.osiApproved).toBe(true);
      expect(project.englishSupport).toBe("verified");
      expect(project.license.evidence).toMatch(/^https:\/\//);
      expect(project.repository).toMatch(/^https:\/\/github\.com\//);
      expect(project.website).toMatch(/^https:\/\//);
      expect(project.lastVerifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("requires evidence for verified or partial Greek support", () => {
    for (const project of projects.filter((item) => ["verified", "partial"].includes(item.greekSupport))) {
      expect(project.greekEvidence).toMatch(/^https:\/\//);
    }
  });

  it("uses editorial score as the default ranking", () => {
    for (let index = 1; index < projects.length; index += 1) {
      expect(projects[index - 1].editorialScore).toBeGreaterThanOrEqual(projects[index].editorialScore);
    }
  });
});
