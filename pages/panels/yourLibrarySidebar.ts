import { Locator, Page, expect } from "@playwright/test";

export class YourLibrarySidebar {
  readonly page: Page;
  readonly yourLibrarySidebar: Locator;
  readonly yourLibrary: Locator;
  readonly createPlaylistOrFolderButton: Locator;
  readonly createPlaylistButton: Locator;
  readonly searchButton: Locator;
  readonly playlistsList: Locator;
  readonly contextMenu: Locator;
  readonly createPlaylistTippyBox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.yourLibrarySidebar = page.locator("#Desktop_LeftSidebar_Id");
    this.yourLibrary = this.yourLibrarySidebar.locator("header");
    this.createPlaylistOrFolderButton = this.yourLibrarySidebar.locator(
      'span:has(> button[aria-label="Create playlist or folder"])'
    );
    this.createPlaylistButton = this.yourLibrarySidebar.locator(`button:has-text("Create")`);
    this.searchButton = this.yourLibrarySidebar.getByRole("search");
    this.playlistsList = this.yourLibrarySidebar.locator('[role="grid"], [role="list"]');
    this.contextMenu = page.getByTestId("context-menu");
    this.createPlaylistTippyBox = page.locator(".tippy-box").getByTestId("createPlaylist-hook");
  }

  async assertYourLibrarySidebarBarIsVisible() {
    await expect(this.yourLibrarySidebar).toBeVisible();
  }

  async assertYourLibraryHeader() {
    await expect(this.yourLibrary).toBeVisible();
    await expect(this.yourLibrary).toHaveText("Your Library");
    await expect(this.createPlaylistOrFolderButton).toBeVisible();
  }

  async clickCreatePlaylistOrFolderButton() {
    await this.createPlaylistOrFolderButton.click();
  }

  async assertSection(sectionType: "createPlaylist" | "browsePodcasts") {
    await expect(
      this.yourLibrarySidebar.locator(
        `div:has(> span:has-text("${
          sectionType === "createPlaylist" ? "Create your first playlist" : "Let's find some podcasts to follow"
        }"))`
      )
    ).toBeVisible();
    await expect(
      this.yourLibrarySidebar.locator(
        `div:has(> span:has-text("${
          sectionType === "createPlaylist" ? "It's easy, we'll help you" : "We'll keep you updated on new episodes"
        }"))`
      )
    ).toBeVisible();
    await expect(
      this.yourLibrarySidebar.locator(
        `div:has(${sectionType === "createPlaylist" ? "> button:has-text('Create playlist')" : "> a:has-text('Browse podcasts')"})`
      )
    ).toBeVisible();
  }

  async clickCreatePlaylist() {
    await this.createPlaylistButton.click();
  }

  async clickSearchButton() {
    await this.searchButton.click();
  }

  async fillSearchInput(input: string) {
    await this.searchButton.getByRole("searchbox").fill(input);
  }

  async clickPlaylistItem(title: string) {
    await this.playlistsList.locator('[role="gridcell"], [role="listitem"]').filter({ hasText: title }).click();
  }

  async assertPlaylistContextMenu({ authenticated }: { authenticated: boolean }) {
    if (authenticated) {
      await expect(this.contextMenu).toBeVisible();
      const menuItems = [
        { name: "Playlist", description: "Build a playlist with songs, or episodes" },
        { name: "Blend", description: "Mix up your tastes with friends" },
        { name: "Folder", description: "Organize your playlists" },
      ];
      for (const item of menuItems) {
        await expect(
          this.contextMenu.locator("[id*='listrow-title-global-create-']").filter({ hasText: item.name })
        ).toBeVisible();
        await expect(
          this.contextMenu.locator("[id*='subtitle-global-create-']").filter({ hasText: item.description })
        ).toBeVisible();
      }
    } else {
      const item = this.contextMenu.locator("li");
      await expect(item).toBeVisible();
      await expect(item).toHaveText("Create a new playlist");
    }
  }

  async clickContextMenuItem({
    authenticated,
    itemType,
  }: {
    authenticated: boolean;
    itemType?: "playlist" | "blend" | "folder";
  }) {
    if (authenticated) {
      await this.contextMenu.locator(`#listrow-title-global-create-${itemType}`).click();
    } else {
      await this.contextMenu.locator("li").click();
    }
  }

  async assertCreatePlaylistTippyBox() {
    const title = this.createPlaylistTippyBox.locator("div>p");
    const description = this.createPlaylistTippyBox.locator(">p");
    const notNowButton = this.createPlaylistTippyBox.locator("button").first();
    const logInButton = this.createPlaylistTippyBox.locator("button").last();
    await expect(title).toBeVisible();
    await expect(title).toHaveText("Create a playlist");
    await expect(description).toBeVisible();
    await expect(description).toHaveText("Log in to create and share playlists.");
    await expect(notNowButton).toBeVisible();
    await expect(notNowButton).toHaveText("Not now");
    await expect(logInButton).toBeVisible();
    await expect(logInButton).toHaveText("Log in");
  }
}
