import { Locator, Page, expect } from "@playwright/test";

export class EditPlaylistDetails {
  readonly page: Page;
  readonly editPlaylistDetails: Locator;

  constructor(page: Page) {
    this.page = page;
    this.editPlaylistDetails = page.getByTestId("playlist-edit-details-modal");
  }

  async assertEditPlaylistDetailsIsVisible({ visible }: { visible: boolean }) {
    if (visible) {
      await expect(this.editPlaylistDetails).toBeVisible();
    } else {
      await expect(this.editPlaylistDetails).not.toBeVisible();
    }
  }

  async fillNameInput(name: string) {
    await this.editPlaylistDetails.getByTestId("playlist-edit-details-name-input").fill(name);
  }

  async fillDescriptionInput(description: string) {
    await this.editPlaylistDetails.getByTestId("playlist-edit-details-description-input").fill(description);
  }

  async clickSaveButton() {
    await this.editPlaylistDetails.getByTestId("playlist-edit-details-save-button").click();
  }
}
