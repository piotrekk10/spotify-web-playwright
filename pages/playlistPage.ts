import { Locator, Page, expect } from "@playwright/test";
import { PlaylistDataType } from "fixtures/data/playlists";
import { TrackDataType } from "fixtures/data/tracks";
import { msToTime } from "support/utils";

export class PlaylistPage {
  readonly page: Page;
  readonly playlistPage: Locator;
  readonly playlistTitle: Locator;
  readonly playlistTracklist: Locator;

  constructor(page: Page) {
    this.page = page;
    this.playlistPage = page.getByTestId("playlist-page");
    this.playlistTitle = this.playlistPage.getByTestId("entityTitle");
    this.playlistTracklist = this.playlistPage.getByTestId("playlist-tracklist");
  }

  async assertPlaylistPageIsVisible() {
    await expect(this.playlistPage).toBeVisible();
  }

  async assertPlaylistDetails(playlist: PlaylistDataType) {
    const songCount = this.playlistPage.locator("div > span").filter({ hasText: " songs" });
    await expect(this.playlistTitle).toBeVisible();
    await expect(this.playlistTitle).toHaveText(playlist.name);
    await expect(songCount).toBeVisible();
    await expect(songCount).toHaveText(`${playlist.tracks.length} songs`);
  }

  async assertPlaylistItem(track: TrackDataType) {
    const playlistItem = this.playlistPage
      .getByTestId("tracklist-row")
      .filter({ hasText: track.title })
      .filter({ hasText: track.album });
    const title = playlistItem.getByTestId("internal-track-link");
    const artists = playlistItem.locator("div:has(a[data-testid='internal-track-link'])>span:has(a)");
    const album = playlistItem.locator("a.standalone-ellipsis-one-line");
    const duration = playlistItem.locator("div:has(button[aria-label='Add to playlist'])>div");
    await expect(playlistItem).toBeVisible();
    await expect(title).toBeVisible();
    await expect(title).toHaveText(track.title);
    await expect(title).toHaveAttribute("href", `/track/${track.id}`);
    await expect(artists).toBeVisible();
    for (const artist of track.artists) {
      await expect(artists).toContainText(artist);
    }
    await expect(album).toBeVisible();
    await expect(album).toHaveText(track.album);
    await expect(duration).toBeVisible();
    await expect(duration).toHaveText(msToTime(track.duration));
  }

  async clickPlaylistTitle() {
    await this.playlistTitle.click();
  }
}
