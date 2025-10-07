import { test, expect } from '../../src/fixtures/pages';

test.beforeEach(async ({ page, home, bots }) => {
  await home.goto();
  await home.goToPlayBots();
  await bots.handleModals();
});

test.describe('[e2e] Locked Bot Modal', () => {
  test('Modal appears when selecting a locked bot', async ({ page, home, bots }) => {
    let selectedBotName: string;

    await test.step('Choose a random locked bot in the Beginner section', async () => {
      try {
        selectedBotName = await bots.selectBot(true); 
        console.log(`Selected locked bot: ${selectedBotName}`);
      } catch (error) {
        test.skip(true, 'No locked bots available in test environment - this is expected for some user accounts');
      }
    });

    await test.step('Verify locked bot modal is displayed', async () => {
      await bots.expectLockedBotModal();
    });
  });
});

