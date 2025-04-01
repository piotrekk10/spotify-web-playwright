import { Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/");
    await this.page.waitForResponse(/.*pathfinder\/v1\/query.*/);
  }
}
