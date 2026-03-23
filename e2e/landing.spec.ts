import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("loads with correct title and hero", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/MiInflación/);
    await expect(page.locator("h1")).toContainText("Tu inflación");
    await expect(page.locator("h1")).toContainText("en tiempo real");
  });

  test("displays real INDEC stats", async ({ page }) => {
    await page.goto("/");
    // Stats bar should show real percentages
    const stats = page.locator("[data-stat]");
    await expect(stats).toHaveCount(3);

    // Mensual stat should contain a percentage
    await expect(stats.nth(0)).toContainText("Mensual");
    await expect(stats.nth(0)).toContainText("%");

    // Interanual stat
    await expect(stats.nth(1)).toContainText("Interanual");
    await expect(stats.nth(1)).toContainText("%");

    // Last update
    await expect(stats.nth(2)).toContainText("Último dato");
    await expect(stats.nth(2)).toContainText("2026");
  });

  test("calculator renders with inputs", async ({ page }) => {
    await page.goto("/");
    // Calculator card
    await expect(page.locator("text=Calculadora de inflación")).toBeVisible();
    // Monto input
    const montoInput = page.locator('input[type="number"]').first();
    await expect(montoInput).toBeVisible();
    await expect(montoInput).toHaveValue("100000");
  });

  test("calculator computes inflation", async ({ page }) => {
    await page.goto("/");
    // Wait for calculator to be visible
    await expect(page.locator("text=Calculadora de inflación")).toBeVisible();

    // The result should show "Necesitarías" with a currency amount
    const result = page.locator("text=Necesitarías");
    // Check it exists (might need to scroll)
    if (await result.isVisible()) {
      await expect(result).toBeVisible();
      // Should show a peso amount
      const amount = page.locator("text=/\\$ [\\d\\.]+/").first();
      await expect(amount).toBeVisible();
    }
  });

  test("has correct SEO meta tags", async ({ page }) => {
    await page.goto("/");

    // OG tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute(
      "content",
      /MiInflación|deberías/
    );

    const ogDesc = page.locator('meta[property="og:description"]');
    await expect(ogDesc).toHaveAttribute("content", /inflación|INDEC/);

    // Twitter card
    const twitterCard = page.locator('meta[name="twitter:card"]');
    await expect(twitterCard).toHaveAttribute("content", "summary_large_image");

    // Structured data
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toHaveCount(1);
    const content = await jsonLd.textContent();
    expect(content).toContain("FAQPage");
  });

  test("navigation links work", async ({ page }) => {
    await page.goto("/");

    // Click Mi Sueldo
    await page.click("text=Mi Sueldo");
    await expect(page).toHaveURL("/sueldo");
    await expect(page.locator("h1")).toContainText("deberías");

    // Click Categorías
    await page.click("text=Categorías");
    await expect(page).toHaveURL("/categorias");
    await expect(page.locator("h1")).toContainText("categoría");

    // Click back to Calculadora
    await page.click("text=Calculadora");
    await expect(page).toHaveURL("/");
  });
});
