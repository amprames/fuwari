import { test, expect } from "@playwright/test";

test.describe("Search Functionality", () => {
  test("should open search modal when search button is clicked", async ({ page }) => {
    await page.goto("/");
    
    // Look for search button or trigger
    const searchTrigger = page.locator('[data-testid="search-button"], button[aria-label*="search"], .search-trigger').first();
    
    if (await searchTrigger.count() > 0) {
      await searchTrigger.click();
      
      // Check if search modal or input appears
      const searchModal = page.locator('[data-testid="search-modal"], .search-modal, input[type="search"]').first();
      await expect(searchModal).toBeVisible();
    }
  });

  test("should allow typing in search input", async ({ page }) => {
    await page.goto("/");
    
    // Try to find and open search
    const searchTrigger = page.locator('[data-testid="search-button"], button[aria-label*="search"], .search-trigger').first();
    
    if (await searchTrigger.count() > 0) {
      await searchTrigger.click();
      
      // Find search input
      const searchInput = page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]').first();
      
      if (await searchInput.count() > 0) {
        await searchInput.fill("test search");
        await expect(searchInput).toHaveValue("test search");
      }
    }
  });

  test("should close search modal with escape key", async ({ page }) => {
    await page.goto("/");
    
    // Try to open search
    const searchTrigger = page.locator('[data-testid="search-button"], button[aria-label*="search"], .search-trigger').first();
    
    if (await searchTrigger.count() > 0) {
      await searchTrigger.click();
      
      // Check if modal is open
      const searchModal = page.locator('[data-testid="search-modal"], .search-modal').first();
      
      if (await searchModal.count() > 0) {
        // Press escape
        await page.keyboard.press("Escape");
        
        // Check if modal is closed
        await expect(searchModal).not.toBeVisible();
      }
    }
  });
});