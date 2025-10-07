import { Page } from '@playwright/test';
import friendsData from './friends';

export async function mockFriendsAPI(
  page: Page,
  overrides?: any
) {
  let mockData = { ...friendsData };
  
  // Apply any overrides if provided
  if (overrides) {
    mockData = { ...mockData, ...overrides };
  }

  await page.route(`**/service/friends-search/idl/chesscom.friends_search.v1.FriendsSearchService/QueryFriends*`, async route => {
    // Only intercept POST requests
    if (route.request().method() !== 'POST') {
      route.continue();
      return;
    }


    try {
      // Get the original response
      const response = await route.fetch();
      const originalData = await response.json();

      // Only modify the username field in the response
      if (originalData.friends && Array.isArray(originalData.friends)) {
        originalData.friends.forEach((friend: any) => {
          if (friend.userView && friend.userView.username) {
            friend.userView.username = mockData.friends[0].username; // Use "MOCK USER"
          }
        });
      }

      await route.fulfill({
        status: response.status(),
        headers: response.headers(),
        body: JSON.stringify(originalData)
      });
    } catch (error) {
    }
  });

  return mockData;
}

export async function mockEmptyFriendsAPI(
  page: Page,
  overrides?: any
) {
  // Mock the friends search API
  await page.route(`**/QueryFriends*`, async route => {
    // Only intercept POST requests
    if (route.request().method() !== 'POST') {
      route.continue();
      return;
    }


    // Return empty friends list
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        pagination: {
          nextPageToken: "",
          totalSize: 0
        },
        friends: []
      })
    });
  });

  // Mock the friends count API
  await page.route(`**/GetFriendsCount*`, async route => {

    // Return empty count
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({}), 
    });
  });
}

export async function mockFriendDeletionAPI(
  page: Page,
  overrides?: any
) {
  // Mock the friend deletion API
  await page.route(`**/callback/friend/delete/*`, async route => {
    // Only intercept DELETE requests
    if (route.request().method() !== 'DELETE') {
      route.continue();
      return;
    }


    // Extract friend ID from URL for response message
    const url = route.request().url();
    const friendIdMatch = url.match(/\/callback\/friend\/delete\/(\d+)/);
    const friendId = friendIdMatch ? friendIdMatch[1] : 'unknown';

    // Return success response
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        message: `Friend with ID ${friendId} has been removed from your friends list`
      })
    });
  });
}