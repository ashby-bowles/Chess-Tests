import { Page, BrowserContext, expect } from '@playwright/test';

export class AuthHelper {
  private readonly page: Page;
  private readonly context: BrowserContext;

  constructor(page: Page) {
    this.page = page;
    this.context = page.context();
  }

  /**
   * Performs login and saves authentication state
   * This should be called once to generate the storageState file
   */
  async loginAndSaveState(username: string, password: string, storageStatePath: string): Promise<void> {
    // Navigate to login page
    await this.page.goto('/login');
    
    // Fill in credentials
    await this.page.getByRole('textbox', { name: 'Username, Phone, or Email' }).fill(username);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    
    // Click login button
    await this.page.getByRole('button', { name: 'Log In' }).click();
    
    // Wait for successful login - check for redirect away from login page
    await this.page.waitForURL(url => !url.toString().includes('/login'), { timeout: 10000 });
    
    // Wait for page to stabilize by checking for user-specific elements
    await expect(this.page.locator('a[href*="/member/"]').first()).toBeVisible({ timeout: 5000 });
    
    // Save authentication state
    await this.context.storageState({ path: storageStatePath });
    
    console.log(`Authentication state saved to ${storageStatePath}`);
  }

  /**
   * Checks if user is currently logged in
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      const currentUrl = this.page.url();
      
      // If we're on login page, we're not logged in
      if (currentUrl.includes('/login')) {
        return false;
      }
      
      // Check for user-specific elements that indicate logged in state
      const userElements = [
        this.page.locator('[data-testid="user-menu"]'),
        this.page.locator('a[href*="/member/"]'),
        this.page.locator('text=Log Out'),
        this.page.locator('text=Sign Out')
      ];
      
      for (const element of userElements) {
        if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
          return true;
        }
      }
      
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Logs out the current user
   */
  async logout(): Promise<void> {
    // Look for logout button/link
    const logoutSelectors = [
      'text=Log Out',
      'text=Sign Out',
      '[data-testid="logout"]',
      'a[href*="/logout"]'
    ];
    
    for (const selector of logoutSelectors) {
      const element = this.page.locator(selector);
      if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
        await element.click();
        await this.page.waitForURL(url => url.toString().includes('/login') || url.toString().includes('/'), { timeout: 5000 });
        return;
      }
    }
    
    // If no logout button found, clear storage
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }
}
