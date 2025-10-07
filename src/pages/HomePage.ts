import { Page, Locator } from '@playwright/test';

export class HomePage {
  private readonly page: Page;
  private readonly playLink: Locator;
  private readonly playVsComputerLink: Locator;
  private readonly socialLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // Navigation link for Play
    this.playLink = page.locator('a.nav-link-component').filter({ hasText: 'Play' });
    // Direct link to Play Bots
    this.playVsComputerLink = page.getByRole('link', { name: 'Play Bots' });
    // Navigation link for Social
    this.socialLink = page.locator('a.nav-link-component').filter({ hasText: 'Social' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async openPlayMenu(): Promise<void> {
    // Click the Play navigation link
    await this.playLink.click();
  }

  async goToPlayBots(): Promise<void> {
    // Click directly on "Play Bots" link from homepage
    await this.playVsComputerLink.click();
    
    // Handle the modal that appears
    await this.handlePlayBotsModal();
  }

  async goToSocial(): Promise<void> {
    await this.socialLink.click();
  }

  private async handlePlayBotsModal(): Promise<void> {
    // Proactively dismiss the intro modal by setting localStorage
    await this.page.evaluate(() => {
      localStorage.setItem('play_vs_computer_intro_modal_dismissed', 'true');
    });

    // Wait for and click the "Start" button in the modal
    const startButton = this.page.getByRole('button', { name: 'Start' });
    if (await startButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await startButton.click();
    }
  }
}


