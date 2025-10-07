import { test as baseTest } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { BotsPage } from '../pages/BotsPage';
import { GamePage } from '../pages/GamePage';
import { SocialPage } from '../pages/SocialPage';
import { FriendsPage } from '../pages/FriendsPage';
import { AuthHelper } from '../helpers/auth';

type MyPages = {
  home: HomePage;
  bots: BotsPage;
  game: GamePage;
  social: SocialPage;
  friends: FriendsPage;
  auth: AuthHelper;
};

export const test = baseTest.extend<MyPages>({
  home: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  bots: async ({ page }, use) => {
    await use(new BotsPage(page));
  },
  game: async ({ page }, use) => {
    await use(new GamePage(page));
  },
  social: async ({ page }, use) => {
    await use(new SocialPage(page));
  },
  friends: async ({ page }, use) => {
    await use(new FriendsPage(page));
  },
  auth: async ({ page }, use) => {
    await use(new AuthHelper(page));
  },
});

// Route mocking is now handled by individual test files

export { expect } from '@playwright/test';
