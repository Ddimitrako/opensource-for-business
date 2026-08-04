import { z } from "zod";

export const licenseFamilySchema = z.enum([
  "permissive",
  "weak-copyleft",
  "copyleft",
  "network-copyleft",
]);

export const maturitySchema = z.enum(["anchor", "established", "niche-leader"]);
export const companySizeSchema = z.enum(["Small business", "Mid-market", "Enterprise"]);
export const deploymentModeSchema = z.enum(["Docker", "Kubernetes", "Manual", "Desktop"]);
export const serviceTypeSchema = z.enum([
  "Deployment",
  "Migration",
  "Integration",
  "Customization",
  "Training",
  "Support",
  "Managed hosting",
  "Security hardening",
  "Data services",
]);
export const localeStatusSchema = z.enum(["verified", "partial", "unavailable", "unknown"]);

export const categorySchema = z.object({
  id: z.string().min(2),
  name: z.string().min(2),
  description: z.string().min(12),
});

export const departmentSchema = z.object({
  id: z.string().min(2),
  name: z.string().min(2),
  shortName: z.string().min(2),
  description: z.string().min(12),
  icon: z.string().min(2),
  categories: z.array(categorySchema).min(1).max(7),
});

export const licenseProfileSchema = z.object({
  id: z.string().min(2),
  spdx: z.string().min(2),
  name: z.string().min(2),
  family: licenseFamilySchema,
  osiApproved: z.literal(true),
  summary: z.string().min(20),
  obligations: z.array(z.string().min(5)).min(1),
  evidence: z.string().url(),
});

export const projectSeedSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(2),
  edition: z.string().min(2),
  repository: z.string().url().startsWith("https://github.com/"),
  website: z.string().url(),
  summary: z.string().min(25),
  problem: z.string().min(25),
  idealFor: z.string().min(25),
  departmentIds: z.array(z.string()).min(1),
  categoryIds: z.array(z.string()).min(1),
  buyerRoles: z.array(z.string()).min(1),
  companySizes: z.array(companySizeSchema).min(1),
  deploymentModes: z.array(deploymentModeSchema).min(1),
  serviceTypes: z.array(serviceTypeSchema).min(1),
  licenseId: z.string().min(2),
  maturity: maturitySchema,
  editorialScore: z.number().int().min(0).max(100),
  englishSupport: z.literal("verified"),
  greekSupport: localeStatusSchema,
  greekEvidence: z.string().url().optional(),
  editionBoundary: z.string().min(20).optional(),
  featured: z.boolean().optional().default(false),
  lastVerifiedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
}).superRefine((project, context) => {
  if (["verified", "partial"].includes(project.greekSupport) && !project.greekEvidence) {
    context.addIssue({
      code: "custom",
      path: ["greekEvidence"],
      message: "Verified or partial Greek support requires an evidence URL",
    });
  }
});

export const repoSnapshotSchema = z.object({
  slug: z.string().min(2),
  repo: z.string().min(3),
  stars: z.number().int().nonnegative().nullable(),
  latestRelease: z.string().nullable(),
  lastActivity: z.string().nullable(),
  archived: z.boolean(),
  observedLicense: z.string().nullable(),
  licenseDrift: z.boolean(),
  verifiedAt: z.string(),
  status: z.enum(["verified", "pending-refresh", "error"]),
});

export type Department = z.infer<typeof departmentSchema>;
export type Category = z.infer<typeof categorySchema>;
export type LicenseProfile = z.infer<typeof licenseProfileSchema>;
export type LicenseFamily = z.infer<typeof licenseFamilySchema>;
export type ProjectSeed = z.infer<typeof projectSeedSchema>;
export type RepoSnapshot = z.infer<typeof repoSnapshotSchema>;
export type Maturity = z.infer<typeof maturitySchema>;
export type CompanySize = z.infer<typeof companySizeSchema>;
export type DeploymentMode = z.infer<typeof deploymentModeSchema>;
export type ServiceType = z.infer<typeof serviceTypeSchema>;
export type LocaleStatus = z.infer<typeof localeStatusSchema>;

