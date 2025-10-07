import { test, expect } from '../../src/fixtures/ui';
import { mockFriendsAPI, mockEmptyFriendsAPI, mockFriendDeletionAPI } from '../../src/mocks/routeHandlers';

test.describe('[ui] Social Friends flow', () => {
  test.beforeEach(async ({ page, social, friends }) => {
    await mockFriendsAPI(page);
    
    await test.step('Navigate to Social > Friends', async () => {
      await social.goto();
      await expect(page).toHaveURL(/chess\.com/);
      
      await social.openSocialMenu();
      await expect(page).toHaveURL(/social/);
      
      await social.goToFriends();
      await expect(page).toHaveURL(/friends/);
    });
  });

  test.afterEach(async ({ page }) => {
    // Clean up routes to prevent interference between tests
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });

  test('Displays friends list with mocked data', async ({ page, friends }) => {
    await friends.expectFriendsLoaded();
    
    // Verify friends are displayed and mock data is used
    await expect(page.locator('.users-list-item').first()).toBeVisible();
    await expect(page.locator('text=MOCK USER')).toBeVisible();
  });

  test('Displays empty state when no friends', async ({ page, friends }) => {
    await mockEmptyFriendsAPI(page);
    await friends.expectFriendsLoaded();
    
    // Verify empty state messages and no friends in list
    await expect(page.locator('text=Chess is better with friends!')).toBeVisible();
    await expect(page.locator('text=Add friends and their names will appear here.')).toBeVisible();
    expect(await friends.getFriendsCount()).toBe(0);
  });

  test('Removes friend from friends list', async ({ page, friends }) => {
    await mockFriendDeletionAPI(page);
    await friends.expectFriendsLoaded();
    
    // Remove friend and confirm
    await friends.clickShowOptions();
    await friends.clickRemoveFriend();
    await friends.expectConfirmRemovalModalVisible();
    await friends.clickConfirmRemovalYes();
    
    // Verify removal success
    await friends.expectFriendRemovalAlertVisible();
  });
});
