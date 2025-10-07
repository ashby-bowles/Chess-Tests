import { test, expect } from '../../src/fixtures/pages';

test.describe('[e2e] User Login flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear authentication state and local storage to ensure user is logged out
    await page.context().clearCookies();
    // Navigate to a page first to ensure we have access to localStorage
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('User can successfully log in with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/login/);
    
    // Fill and submit login form
    const username = process.env.userName || 'chessTester1122';
    const password = process.env.password || 'Pass1234!';
    
    await page.getByRole('textbox', { name: 'Username, Phone, or Email' }).fill(username);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Log In' }).click();
    
    // Verify successful login and redirect
    await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 10000 });
    await expect(page).toHaveURL(/chess\.com/);
    await expect(page.locator('a[href*="/member/"]').first()).toBeVisible();
    
    // Verify login state persists in authenticated areas
    await page.goto('/friends');
    await expect(page).toHaveURL(/friends/);
    await expect(page).not.toHaveURL(/login/);
  });

  test('User cannot log in with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/login/);
    
    // Submit invalid credentials
    await page.getByRole('textbox', { name: 'Username, Phone, or Email' }).fill('invaliduser');
    await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword');
    await page.getByRole('button', { name: 'Log In' }).click();
    
    // Verify login failure - should remain on login page
    await expect(page).toHaveURL(/login/);
  });
});
