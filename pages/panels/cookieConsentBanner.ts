import { Locator, Page, expect } from "@playwright/test";

export class CookieConsentBanner {
  readonly page: Page;
  readonly cookieConsentBanner: Locator;
  readonly dataProcessingContent: Locator;
  readonly acceptCookiesButton: Locator;
  readonly cookieSettingsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cookieConsentBanner = page.locator('#onetrust-banner-sdk[aria-label="Cookie banner"]');
    this.dataProcessingContent = this.cookieConsentBanner.locator(".ot-dpd-content");

    this.acceptCookiesButton = this.cookieConsentBanner.locator("#onetrust-accept-btn-handler");
    this.cookieSettingsButton = this.cookieConsentBanner.locator("#onetrust-pc-btn-handler");
  }

  async assertCookieConsentBannerIsVisible(visible: boolean) {
    await expect(this.cookieConsentBanner).toBeVisible({ visible });
  }

  async asserPolicyTitle() {
    const policyTitle = this.cookieConsentBanner.locator("#onetrust-policy-title");
    await expect(policyTitle).toBeVisible();
    await expect(policyTitle).toHaveText("We Care About Your Privacy");
  }

  async asserPolicyContent() {
    const policyContent = this.cookieConsentBanner.locator("#onetrust-policy-text");
    await expect(policyContent).toBeVisible();
    await expect(policyContent).toHaveText(
      /We and our \d{1,3} partners store and\/or access information on a device, such as unique IDs in cookies to process personal data\. You may find out more about the purposes for which we and our partners use cookies or exercise your preferences by clicking the \‘Cookie Settings\’ button below\. You can revisit your consent choices or withdraw consent at any time by clicking the link to your cookie settings in our Cookie Policy\. These choices will be signaled to our partners and will not affect browsing data\./
    );
  }

  async asserDataProcessingTitle() {
    const dataProcessingTitle = this.cookieConsentBanner.locator(".ot-dpd-title");
    await expect(dataProcessingTitle).toBeVisible();
    await expect(dataProcessingTitle).toHaveText("We and our partners process data to provide:");
  }

  async asserDataProcessingContent() {
    await expect(this.dataProcessingContent).toBeVisible();
    await expect(this.dataProcessingContent).toHaveText(
      /Store and\/or access information on a device\. Personalised advertising\. Personalised content\. Advertising and content measurement, audience research, and services development\..*/
    );
  }

  async asserDataProcessingVendors() {
    const dataProcessingVendors = this.dataProcessingContent.locator(".ot-link-btn");
    await expect(dataProcessingVendors).toBeVisible();
    await expect(dataProcessingVendors).toHaveText("List of Partners (vendors)");
  }

  async asserAcceptCookiesButton() {
    await expect(this.acceptCookiesButton).toBeVisible();
    await expect(this.acceptCookiesButton).toHaveText("Accept Cookies");
    await expect(this.acceptCookiesButton).toBeEnabled();
  }

  async asserCookieSettingsButton() {
    await expect(this.cookieSettingsButton).toBeVisible();
    await expect(this.cookieSettingsButton).toHaveText("Cookie Settings");
    await expect(this.cookieSettingsButton).toBeEnabled();
  }

  async clickAcceptCookiesButton() {
    await this.acceptCookiesButton.click();
  }

  async skipCookieBanner() {
    await this.assertCookieConsentBannerIsVisible(true);
    await this.clickAcceptCookiesButton();
    await this.assertCookieConsentBannerIsVisible(false);
  }
}
