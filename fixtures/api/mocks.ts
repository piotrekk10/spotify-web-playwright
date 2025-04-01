import { Page } from "@playwright/test";
import { REGEXPS } from "support/constant";
import * as homepagePayload from "fixtures/data/homepagePayload.json";

export async function mockHomepagePayload(page: Page) {
  await page.route(REGEXPS.QUERY_HOMEPAGE_URL, async (route) => {
    route.fulfill({ json: homepagePayload, status: 200 });
  });
}

export async function mockLocation(page: Page) {
  await page.route("https://geolocation.onetrust.com/cookieconsentpub/v1/geo/location", (route) =>
    route.fulfill({
      json: {
        country: "PL",
        state: "24",
        stateName: "Silesia",
        continent: "EU",
      },
    })
  );
}
