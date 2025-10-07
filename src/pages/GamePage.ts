import { Page, expect, Locator } from '@playwright/test';

export class GamePage {
  private readonly page: Page;
  private readonly chatContainer: Locator;
  private readonly opponentName: Locator;
  private readonly chessBoard: Locator;

  constructor(page: Page) {
    this.page = page;
    // Chat container with bot messages
    this.chatContainer = page.locator('.bot-speech-multiple-messages-component');
    // Bot name display in the player area
    this.opponentName = page.locator('#player-top');
    // Chess board - use the main board container ID
    this.chessBoard = page.locator('#board-play-computer');
    
  }

  /**
   * Expectation helper: verifies that a chat panel is visible and contains the bot's name.
   */
  async expectChatVisibleForBot(botName: string): Promise<void> {
    // Verify the chat container is visible
    await expect(this.chatContainer).toBeVisible();
    
    // Verify the chess board is loaded using the reliable ID selector
    await expect(this.chessBoard).toBeVisible();
    
    // Verify bot playing against the selected bot (use contains for flexible matching)
    await expect(this.page.locator('#player-top')).toContainText(botName);
  }

  /**
   * Expectation helper: verifies that a specific bot message is displayed
   */
  async expectBotMessage(expectedMessage: string): Promise<void> {
    const botMessage = this.page.locator('.bot-speech-content-botMessage');
    await expect(botMessage).toHaveText(expectedMessage);
  }

  /**
   * Get the current bot message text
   */
  async getBotMessage(): Promise<string> {
    const messageElement = this.page.locator('.bot-speech-content-botMessage');
    return await messageElement.textContent() || '';
  }

  /**
   * Verify the game has started (board is visible and bot is ready)
   */
  async expectGameStarted(): Promise<void> {
    // Verify the chess board is loaded using the reliable ID selector
    await expect(this.chessBoard).toBeVisible();
    
    // Verify chat is visible
    await expect(this.chatContainer).toBeVisible();
    
  }
}


