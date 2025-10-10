import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load the homepage successfully", async ({ page }) => {
    await page.goto("/");
    
    // Check that the page loads
    await expect(page).toHaveTitle(/Fuwari/);
    
    // Check for main navigation elements
    await expect(page.locator("nav")).toBeVisible();
    
    // Check for main content area
    await expect(page.locator("main")).toBeVisible();
  });

  test("should have working navigation", async ({ page }) => {
    await page.goto("/");
    
    // Check if archive link exists and is clickable
    const archiveLink = page.locator('a[href*="archive"]').first();
    if (await archiveLink.count() > 0) {
      await archiveLink.click();
      await expect(page).toHaveURL(/archive/);
    }
  });

  test("should have responsive design", async ({ page }) => {
    await page.goto("/");
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator("main")).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator("main")).toBeVisible();
  });

  test("should have working theme toggle", async ({ page }) => {
    await page.goto("/");
    
    // Look for theme toggle button
    const themeToggle = page.locator('[data-testid="theme-toggle"], button[aria-label*="theme"], button[aria-label*="dark"], button[aria-label*="light"]').first();
    
    if (await themeToggle.count() > 0) {
      // Get initial theme state
      const initialClass = await page.locator("html").getAttribute("class");
      
      // Click theme toggle
      await themeToggle.click();
      
      // Wait for theme change
      await page.waitForTimeout(100);
      
      // Check that theme changed
      const newClass = await page.locator("html").getAttribute("class");
      expect(newClass).not.toBe(initialClass);
    }
  });
});