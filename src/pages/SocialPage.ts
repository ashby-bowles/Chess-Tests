import { Page, Locator } from '@playwright/test';

export class SocialPage {
  private readonly page: Page;
  private readonly socialLink: Locator;
  private readonly friendsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.socialLink = page.getByRole('link', { name: 'Social' });
    this.friendsLink = page.getByRole('link', { name: 'Friends Find and add friends' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async openSocialMenu(): Promise<void> {
    await this.socialLink.click();
  }

  async goToFriends(): Promise<void> {
    // Proactively dismiss any modals by setting localStorage
    await this.page.evaluate(() => {
      localStorage.setItem('play_vs_computer_intro_modal_dismissed', 'true');
      localStorage.setItem('social_intro_modal_dismissed', 'true');
    });

    // Handle any remaining modals that might be blocking the click
    await this.handleModals();
    await this.friendsLink.click();
  }

  private async handleModals(): Promise<void> {
    // Proactively dismiss the intro modal by setting localStorage
    await this.page.evaluate(() => {
      localStorage.setItem('social_intro_modal_dismissed', 'true');
    });

  }
}
