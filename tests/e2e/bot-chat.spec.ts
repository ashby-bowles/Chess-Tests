import { test, expect } from '../../src/fixtures/pages';

test.beforeEach(async ({ page, home, bots }) => {
  await home.goto();
  await home.goToPlayBots();
  await bots.handleModals();
});

test.describe('[e2e] Bot chat flow', () => {
  test('Chat starts after selecting a random beginner bot and pressing Play', async ({ page, home, bots, game }) => {
    let selectedBotName: string;

    await test.step('Choose a random bot in the Beginner section', async () => {
      selectedBotName = await bots.selectBot(); 
      console.log(`Selected bot: ${selectedBotName}`);
    });

    await test.step('Start game', async () => {
      await bots.startGame();
    });

    await test.step('Verify chat with selected bot is visible', async () => {
      await game.expectChatVisibleForBot(selectedBotName);
      
      // Additional verification: check that we can get the bot message
      const botMessage = await game.getBotMessage();
      expect(botMessage).toBeTruthy();
      expect(botMessage.length).toBeGreaterThan(0);
      
      // Verify game has started properly
      await game.expectGameStarted();
    });
  });
});


