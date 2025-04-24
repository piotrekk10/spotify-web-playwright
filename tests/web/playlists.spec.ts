import { test as _test, expect } from "@playwright/test";
import { mockHomepagePayload } from "fixtures/api/mocks";
import { TEST_PLAYLIST } from "fixtures/data/playlists";
import { PLAYLIST_ITEMS } from "fixtures/data/tracks";

import { HomePage, PlaylistPage } from "pages";
import { EditPlaylistDetails, YourLibrarySidebar } from "pages/panels";

interface TestProps {
  editPlaylistDetails: EditPlaylistDetails;
  homePage: HomePage;
  yourLibrarySidebar: YourLibrarySidebar;
  playlistPage: PlaylistPage;
}

const test = _test.extend<TestProps>({
  editPlaylistDetails: async ({ page }, use) => {
    await use(new EditPlaylistDetails(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  yourLibrarySidebar: async ({ page }, use) => {
    await use(new YourLibrarySidebar(page));
  },
  playlistPage: async ({ page }, use) => {
    await use(new PlaylistPage(page));
  },
});
test.describe("Not logged user", () => {
  test.use({ storageState: ".auth/notAuthUserWithConsent.json" });
  test("should see left sidebar", async ({ homePage, yourLibrarySidebar, page }) => {
    await homePage.goto();
    await mockHomepagePayload(page);
    await yourLibrarySidebar.assertYourLibrarySidebarBarIsVisible();
    await yourLibrarySidebar.assertYourLibraryHeader();
    await yourLibrarySidebar.assertSection("createPlaylist");
    await yourLibrarySidebar.assertSection("browsePodcasts");
  });

  test("should not be able to create playlist", async ({ homePage, yourLibrarySidebar, page }) => {
    await homePage.goto();
    await mockHomepagePayload(page);
    await yourLibrarySidebar.clickCreatePlaylistOrFolderButton();
    await yourLibrarySidebar.assertPlaylistContextMenu({ authenticated: false });
    await yourLibrarySidebar.clickContextMenuItem({ authenticated: false });
    await yourLibrarySidebar.assertCreatePlaylistTippyBox();
  });
});

test.describe("Logged user", () => {
  test.use({ storageState: ".auth/authUserWithConsent.json" });
  test("should be able to search for a playlist and view its tracks", async ({
    homePage,
    yourLibrarySidebar,
    page,
    playlistPage,
  }) => {
    await homePage.goto();
    await mockHomepagePayload(page);
    await yourLibrarySidebar.assertYourLibrarySidebarBarIsVisible();
    await yourLibrarySidebar.clickSearchButton();
    await yourLibrarySidebar.fillSearchInput(TEST_PLAYLIST.name);
    await yourLibrarySidebar.clickPlaylistItem(TEST_PLAYLIST.name);
    await page.waitForURL(new RegExp(`playlist/${TEST_PLAYLIST.id}`));
    await playlistPage.assertPlaylistPageIsVisible();
    await playlistPage.assertPlaylistDetails(TEST_PLAYLIST);
    for (const trackId of TEST_PLAYLIST.tracks) {
      const track = PLAYLIST_ITEMS.find((trackItem) => trackItem.id === trackId);
      await playlistPage.assertPlaylistItem(track!);
    }
  });

  test("should be able to create new playlist and change it's details", async ({
    editPlaylistDetails,
    homePage,
    yourLibrarySidebar,
    playlistPage,
  }) => {
    await homePage.goto();
    await yourLibrarySidebar.assertYourLibrarySidebarBarIsVisible();
    await yourLibrarySidebar.clickCreatePlaylist();
    await yourLibrarySidebar.assertPlaylistContextMenu({ authenticated: true });
    await yourLibrarySidebar.clickContextMenuItem({ authenticated: true, itemType: "playlist" });
    await playlistPage.assertPlaylistPageIsVisible();
    await playlistPage.clickPlaylistTitle();
    const formatted = new Date().toISOString().slice(0, 19).replace("T", " ");
    await editPlaylistDetails.assertEditPlaylistDetailsIsVisible({ visible: true });
    await editPlaylistDetails.fillNameInput(`Playlist name ${formatted}`);
    await editPlaylistDetails.fillDescriptionInput(`Playlist created at ${formatted}`);
    await editPlaylistDetails.clickSaveButton();
    await editPlaylistDetails.assertEditPlaylistDetailsIsVisible({ visible: false });
  });
});
