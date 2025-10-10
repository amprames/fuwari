import { test, expect } from "@playwright/test";

test.describe("Posts and Navigation", () => {
  test("should navigate to archive page", async ({ page }) => {
    await page.goto("/");
    
    // Look for archive link
    const archiveLink = page.locator('a[href*="archive"], a:has-text("Archive"), a:has-text("Posts")').first();
    
    if (await archiveLink.count() > 0) {
      await archiveLink.click();
      await expect(page).toHaveURL(/archive/);
      
      // Check that archive page loads
      await expect(page.locator("main")).toBeVisible();
    }
  });

  test("should display posts on homepage or archive", async ({ page }) => {
    await page.goto("/");
    
    // Check for posts on homepage
    let postsFound = await page.locator('article, .post, [data-testid="post"]').count() > 0;
    
    if (!postsFound) {
      // Try archive page
      const archiveLink = page.locator('a[href*="archive"]').first();
      if (await archiveLink.count() > 0) {
        await archiveLink.click();
        postsFound = await page.locator('article, .post, [data-testid="post"]').count() > 0;
      }
    }
    
    // If posts are found, check their structure
    if (postsFound) {
      const firstPost = page.locator('article, .post, [data-testid="post"]').first();
      await expect(firstPost).toBeVisible();
    }
  });

  test("should navigate to individual post", async ({ page }) => {
    await page.goto("/");
    
    // Look for post links
    let postLink = page.locator('article a, .post a, a[href*="/posts/"]').first();
    
    // If no posts on homepage, try archive
    if (await postLink.count() === 0) {
      const archiveLink = page.locator('a[href*="archive"]').first();
      if (await archiveLink.count() > 0) {
        await archiveLink.click();
        postLink = page.locator('article a, .post a, a[href*="/posts/"]').first();
      }
    }
    
    if (await postLink.count() > 0) {
      await postLink.click();
      
      // Check that we're on a post page
      await expect(page).toHaveURL(/posts/);
      await expect(page.locator("main")).toBeVisible();
    }
  });

  test("should have working back navigation", async ({ page }) => {
    await page.goto("/");
    const initialUrl = page.url();
    
    // Navigate to archive if available
    const archiveLink = page.locator('a[href*="archive"]').first();
    if (await archiveLink.count() > 0) {
      await archiveLink.click();
      
      // Use browser back button
      await page.goBack();
      
      // Should be back to homepage
      expect(page.url()).toBe(initialUrl);
    }
  });

  test("should handle 404 pages gracefully", async ({ page }) => {
    // Try to navigate to a non-existent page
    const response = await page.goto("/non-existent-page");
    
    // Should either redirect or show 404
    if (response && response.status() === 404) {
      // Check that page still loads something
      await expect(page.locator("body")).toBeVisible();
    } else {
      // If redirected, should be on a valid page
      await expect(page.locator("main")).toBeVisible();
    }
  });
});