import { test as _test } from "@playwright/test";
import { mockLocation } from "fixtures/api/mocks";

import { HomePage } from "pages";
import { CookieConsentBanner } from "pages/panels";
import { REGEXPS } from "support/constant";

interface TestProps {
  cookieConsentBanner: CookieConsentBanner;
  homePage: HomePage;
}

const test = _test.extend<TestProps>({
  cookieConsentBanner: async ({ page }, use) => {
    await use(new CookieConsentBanner(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});

test.describe("Not logged user", () => {
  test("should see cookies banner and accept the consent", async ({ page, cookieConsentBanner, homePage }) => {
    await homePage.goto();
    await mockLocation(page);
    await cookieConsentBanner.assertCookieConsentBannerIsVisible(true);
    await cookieConsentBanner.asserPolicyTitle();
    await cookieConsentBanner.asserPolicyContent();
    await cookieConsentBanner.asserDataProcessingTitle();
    await cookieConsentBanner.asserDataProcessingContent();
    await cookieConsentBanner.asserDataProcessingVendors();
    await cookieConsentBanner.asserAcceptCookiesButton();
    await cookieConsentBanner.asserCookieSettingsButton();
    await cookieConsentBanner.clickAcceptCookiesButton();
    await page.waitForResponse(REGEXPS.CONSENT_RECEIPTS_URL);
    await cookieConsentBanner.assertCookieConsentBannerIsVisible(false);
  });
});
