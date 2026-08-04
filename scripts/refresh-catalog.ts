import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const projectSchema = z.object({
  slug: z.string(),
  repository: z.string().url(),
  licenseId: z.string(),
  editorialScore: z.number(),
});
const licenseSchema = z.object({ id: z.string(), spdx: z.string() });
const snapshotSchema = z.object({
  slug: z.string(),
  repo: z.string(),
  stars: z.number().nullable(),
  latestRelease: z.string().nullable(),
  lastActivity: z.string().nullable(),
  archived: z.boolean(),
  observedLicense: z.string().nullable(),
  licenseDrift: z.boolean(),
  verifiedAt: z.string(),
  status: z.enum(["verified", "pending-refresh", "error"]),
});

type Snapshot = z.infer<typeof snapshotSchema>;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDirectory = path.join(root, "src", "data");
const token = process.env.GITHUB_TOKEN;
const headers: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "opensource-for-business-catalog-refresh",
};
if (token) headers.Authorization = `Bearer ${token}`;

function normalizedSpdx(value: string | null) {
  if (!value) return null;
  const aliases: Record<string, string> = {
    "GPL-2.0": "GPL-2.0-only",
    "GPL-3.0": "GPL-3.0-only",
    "LGPL-2.1": "LGPL-2.1-only",
    "LGPL-3.0": "LGPL-3.0-only",
    "AGPL-3.0": "AGPL-3.0-only",
  };
  return aliases[value] ?? value;
}

async function readJson<T>(filename: string, schema: z.ZodType<T>) {
  const raw = JSON.parse(await readFile(path.join(dataDirectory, filename), "utf8"));
  return schema.parse(raw);
}

async function githubJson(url: string) {
  const response = await fetch(url, { headers });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json() as Promise<Record<string, unknown>>;
}

async function refreshProject(
  project: { slug: string; repository: string; licenseId: string },
  expectedSpdx: string,
  previous?: Snapshot,
): Promise<Snapshot> {
  const repo = project.repository.replace("https://github.com/", "").replace(/\/$/, "");
  const verifiedAt = new Date().toISOString();
  try {
    const repository = await githubJson(`https://api.github.com/repos/${repo}`);
    if (!repository) throw new Error("Repository not found");
    let latestRelease = previous?.latestRelease ?? null;
    if (token) {
      const release = await githubJson(`https://api.github.com/repos/${repo}/releases/latest`);
      latestRelease = typeof release?.tag_name === "string" ? release.tag_name : null;
    }
    const licenseObject = repository.license as { spdx_id?: unknown } | null;
    const observedLicense = typeof licenseObject?.spdx_id === "string" ? licenseObject.spdx_id : null;
    return {
      slug: project.slug,
      repo,
      stars: typeof repository.stargazers_count === "number" ? repository.stargazers_count : null,
      latestRelease,
      lastActivity: typeof repository.pushed_at === "string" ? repository.pushed_at : null,
      archived: repository.archived === true,
      observedLicense,
      licenseDrift: Boolean(
        observedLicense
        && observedLicense !== "NOASSERTION"
        && normalizedSpdx(observedLicense) !== normalizedSpdx(expectedSpdx),
      ),
      verifiedAt,
      status: "verified",
    };
  } catch (error) {
    console.warn(`[${project.slug}] ${error instanceof Error ? error.message : "Refresh failed"}`);
    return {
      slug: project.slug,
      repo,
      stars: previous?.stars ?? null,
      latestRelease: previous?.latestRelease ?? null,
      lastActivity: previous?.lastActivity ?? null,
      archived: previous?.archived ?? false,
      observedLicense: previous?.observedLicense ?? null,
      licenseDrift: previous?.licenseDrift ?? false,
      verifiedAt,
      status: "error",
    };
  }
}

async function main() {
  const [projects, licenses, existing] = await Promise.all([
    readJson("projects.json", projectSchema.array()),
    readJson("licenses.json", licenseSchema.array()),
    readJson("repo-snapshots.json", snapshotSchema.array()),
  ]);
  const licenseById = new Map(licenses.map((license) => [license.id, license.spdx]));
  const snapshotBySlug = new Map(existing.map((snapshot) => [snapshot.slug, snapshot]));
  const snapshots: Snapshot[] = [];

  for (const project of projects.toSorted((a, b) => b.editorialScore - a.editorialScore)) {
    const expectedSpdx = licenseById.get(project.licenseId);
    if (!expectedSpdx) throw new Error(`Unknown license ${project.licenseId} on ${project.slug}`);
    snapshots.push(await refreshProject(project, expectedSpdx, snapshotBySlug.get(project.slug)));
  }

  await writeFile(
    path.join(dataDirectory, "repo-snapshots.json"),
    `${JSON.stringify(snapshots, null, 2)}\n`,
    "utf8",
  );
  const drift = snapshots.filter((snapshot) => snapshot.licenseDrift);
  console.log(`Refreshed ${snapshots.length} repositories. ${drift.length} license drift flag(s).`);
  if (drift.length) console.log(`Manual review required: ${drift.map((item) => item.slug).join(", ")}`);
}

await main();
