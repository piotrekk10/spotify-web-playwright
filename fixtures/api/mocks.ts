import { Page } from "@playwright/test";
import { REGEXPS } from "support/constant";
import * as homepagePayload from "fixtures/data/homepagePayload.json";

export async function mockHomepagePayload(page: Page) {
  await page.route(REGEXPS.QUERY_HOMEPAGE_URL, async (route) => {
    route.fulfill({ json: homepagePayload, status: 200 });
  });
}
