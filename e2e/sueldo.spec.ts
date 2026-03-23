import { test, expect } from "@playwright/test";

test.describe("Mi Sueldo Page", () => {
  test("renders salary form", async ({ page }) => {
    await page.goto("/sueldo");
    await expect(page).toHaveTitle(/Sueldo/);
    await expect(page.locator("h1")).toContainText("deberías");

    // Form inputs
    await expect(page.locator("text=Sueldo cuando empezaste")).toBeVisible();
    await expect(page.locator("text=Tu sueldo actual")).toBeVisible();
    await expect(page.locator('button:has-text("Calcular")')).toBeVisible();
  });

  test("calculates salary adjustment on click", async ({ page }) => {
    await page.goto("/sueldo");

    // Fill salary inputs
    const inputs = page.locator('input[type="number"]');
    await inputs.nth(0).fill("500000");
    await inputs.nth(1).fill("800000");

    // Click calculate
    await page.click('button:has-text("Calcular")');

    // Should show "Deberías cobrar" result
    await expect(page.locator("text=Deberías cobrar")).toBeVisible({
      timeout: 5000,
    });

    // Should show a large currency amount
    await expect(page.locator("text=/\\$ [\\d\\.]+/").first()).toBeVisible();

    // Should show loss badge
    await expect(
      page.locator("text=/Perdiste.*poder adquisitivo/")
    ).toBeVisible();

    // Should show category comparison bars
    await expect(page.locator("text=Tu aumento vs inflación")).toBeVisible();
    await expect(page.locator("text=Tu aumento")).toBeVisible();
  });

  test("share buttons appear after calculation", async ({ page }) => {
    await page.goto("/sueldo");

    const inputs = page.locator('input[type="number"]');
    await inputs.nth(0).fill("500000");
    await inputs.nth(1).fill("800000");

    await page.click('button:has-text("Calcular")');
    await expect(page.locator("text=Deberías cobrar")).toBeVisible({
      timeout: 5000,
    });

    // Share buttons
    await expect(page.locator("text=Copiar")).toBeVisible();
    await expect(page.locator("text=Twitter")).toBeVisible();
    await expect(page.locator("text=WhatsApp")).toBeVisible();
  });
});
