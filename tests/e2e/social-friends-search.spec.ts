import { test, expect } from '../../src/fixtures/pages';

test.describe('[e2e] Social Friends Search flow', () => {
  test('Searches for friends by username', async ({ page, social, friends }) => {
    // Navigate to friends page
    await social.goto();
    await social.openSocialMenu();
    await social.goToFriends();
    await expect(page).toHaveURL(/friends/);
    
    // Verify search functionality
    await friends.expectFriendsLoaded();
    await friends.expectSearchInputVisible();
    
    // Search for a friend
    await friends.searchForFriend('MagnusCarlsen');
    await expect(friends.searchInput).toHaveValue('MagnusCarlsen');
    await friends.expectSearchResultsVisible('MagnusCarlsen');
    
    // Clear search
    await friends.clearSearch();
    await expect(friends.searchInput).toHaveValue('');
  });
});
