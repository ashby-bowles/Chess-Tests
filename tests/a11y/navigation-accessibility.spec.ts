import { test, expect } from '../../src/fixtures/pages';
import AxeBuilder from '@axe-core/playwright';

test.describe('[a11y] Navigation Accessibility', () => {
  test('Home page accessibility scan', async ({ page, home }) => {
    await test.step('Navigate to home page', async () => {
      await home.goto();
      await expect(page).toHaveURL(/chess\.com/);
    });

    await test.step('Perform accessibility scan', async () => {
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test('Play menu accessibility scan', async ({ page, home }) => {
    await test.step('Navigate to home page', async () => {
      await home.goto();
      await expect(page).toHaveURL(/chess\.com/);
    });

    await test.step('Open Play menu', async () => {
      await home.openPlayMenu();
      await page.waitForLoadState('networkidle');
    });

    await test.step('Perform accessibility scan', async () => {
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test('Social menu accessibility scan', async ({ page, social }) => {
    await test.step('Navigate to home page', async () => {
      await social.goto();
      await expect(page).toHaveURL(/chess\.com/);
    });

    await test.step('Open Social menu', async () => {
      await social.openSocialMenu();
      await page.waitForLoadState('networkidle');
    });

    await test.step('Perform accessibility scan', async () => {
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test('Friends page accessibility scan', async ({ page, social, friends }) => {
    await test.step('Navigate to home page', async () => {
      await social.goto();
      await expect(page).toHaveURL(/chess\.com/);
    });

    await test.step('Navigate to Social > Friends', async () => {
      await social.openSocialMenu();
      await social.goToFriends();
      await expect(page).toHaveURL(/friends/);
    });

    await test.step('Perform accessibility scan', async () => {
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test('Bots page accessibility scan', async ({ page, home, bots }) => {
    await test.step('Navigate to home page', async () => {
      await home.goto();
      await expect(page).toHaveURL(/chess\.com/);
    });

    await test.step('Navigate to Play > Bots', async () => {
      await home.goToPlayBots();
      await expect(page).toHaveURL(/play\/computer/);
    });

    await test.step('Perform accessibility scan', async () => {
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });
});
