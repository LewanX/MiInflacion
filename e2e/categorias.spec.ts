import { test, expect } from "@playwright/test";

test.describe("Categorías Page", () => {
  test("renders with heading and period selector", async ({ page }) => {
    await page.goto("/categorias");
    await expect(page).toHaveTitle(/Categorías/);
    await expect(page.locator("h1")).toContainText("categoría");
    await expect(page.locator("text=Período")).toBeVisible();
  });

  test("displays all 12 COICOP categories", async ({ page }) => {
    await page.goto("/categorias");

    // Check category cards exist (12 categories)
    const cards = page.locator("[data-cat-card]");
    await expect(cards).toHaveCount(12);

    // Check key categories are present
    await expect(page.locator("text=Alimentos")).toBeVisible();
    await expect(page.locator("text=Vivienda")).toBeVisible();
    await expect(page.locator("text=Transporte")).toBeVisible();
    await expect(page.locator("text=Salud")).toBeVisible();
    await expect(page.locator("text=Educación")).toBeVisible();
  });

  test("shows Nivel General in ranking", async ({ page }) => {
    await page.goto("/categorias");
    await expect(page.locator("text=Nivel General")).toBeVisible();
  });

  test("category cards show percentages", async ({ page }) => {
    await page.goto("/categorias");

    // Each card should have Mensual and Acumulada labels
    await expect(page.locator("text=Mensual").first()).toBeVisible();
    await expect(page.locator("text=Acumulada").first()).toBeVisible();

    // Percentage values should be visible
    const percentages = page.locator("text=/%$/");
    expect(await percentages.count()).toBeGreaterThan(5);
  });
});

test.describe("Responsive", () => {
  test("mobile layout at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    // Hamburger menu should be visible on mobile
    await expect(page.locator('button[aria-label="Menú"]')).toBeVisible();

    // Desktop nav links should be hidden
    const desktopNav = page.locator(".hidden.md\\:flex");
    await expect(desktopNav).toBeHidden();

    // Hero should still be visible
    await expect(page.locator("h1")).toContainText("Tu inflación");
  });

  test("mobile navigation works", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    // Open hamburger
    await page.click('button[aria-label="Menú"]');

    // Mobile menu links should appear
    await expect(page.locator("text=Mi Sueldo").first()).toBeVisible();
    await page.click("text=Mi Sueldo");
    await expect(page).toHaveURL("/sueldo");
  });
});
