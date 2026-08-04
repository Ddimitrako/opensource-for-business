import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("navigates from a department to a project profile", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Finance & Accounting/ }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Finance & Accounting" })).toBeVisible();
  await page.getByRole("link", { name: "ERPNext" }).first().click();
  await expect(page.getByRole("heading", { level: 1, name: "ERPNext" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Commercial service opportunities" })).toBeVisible();
});

test("searches and persists catalog filters in the URL", async ({ page }) => {
  await page.goto("/catalog/");
  await page.getByLabel("Department").selectOption("data");
  await expect(page).toHaveURL(/department=data/);
  await page.getByRole("searchbox", { name: "Search projects" }).fill("Metabase");
  await expect(page.getByRole("heading", { name: "Metabase OSS" })).toBeVisible();
  await page.getByLabel("Department").selectOption("");
  await expect(page).not.toHaveURL(/department=data/);
  await page.getByRole("searchbox", { name: "Search projects" }).fill("Greek UI");
  await expect(page.getByRole("heading", { name: "Odoo Community" })).toBeVisible();
});

test("stores a shortlist and opens a shareable comparison", async ({ page }) => {
  await page.goto("/projects/erpnext/");
  await page.getByRole("button", { name: "Add ERPNext to shortlist" }).click();
  await page.goto("/projects/odoo-community/");
  await page.getByRole("button", { name: "Add Odoo Community to shortlist" }).click();
  await page.getByRole("link", { name: /Shortlist/ }).first().click();
  await expect(page.getByText("2 saved projects")).toBeVisible();
  await page.getByRole("link", { name: "Compare 2" }).click();
  await expect(page).toHaveURL(/projects=erpnext(?:%2C|,)odoo-community/);
  await expect(page.getByRole("heading", { name: "ERPNext" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Odoo Community" })).toBeVisible();
});

test("core pages have no automatically detectable accessibility violations", async ({ page }) => {
  for (const route of ["/", "/catalog/", "/projects/keycloak/"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, `${route}: ${results.violations.map((item) => item.id).join(", ")}`).toEqual([]);
  }
});
