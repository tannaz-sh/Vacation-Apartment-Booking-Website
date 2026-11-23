import { test, expect } from '@playwright/test';

test('support opens, reports missing content honestly, and restores keyboard focus', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Hilfe öffnen' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Wie können wir helfen?' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading')).toBeFocused();
  await expect(dialog.getByRole('status')).toContainText('noch keine Antworten');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole('link', { name: 'Kontakt aufnehmen' }).click();
  await expect(page).toHaveURL(/\/kontakt$/);
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('support panel fits a narrow viewport and does not hide the close control', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/buchen');
  await page.getByRole('button', { name: 'Hilfe öffnen' }).click();
  const panel = await page.getByRole('dialog').boundingBox();
  expect(panel).not.toBeNull();
  expect(panel!.x).toBeGreaterThanOrEqual(0);
  expect(panel!.x + panel!.width).toBeLessThanOrEqual(320);
  await expect(page.getByRole('dialog').getByRole('button', { name: 'Hilfe schließen' })).toBeVisible();
});

test('booking loads the account embed in place without a provider link-out', async ({ page }) => {
  let loaded = false;
  // Deterministic widget harness only; this does not verify provider booking/payment.
  await page.route('https://login.smoobu.com/js/Settings/BookingToolIframe.js', route => {
    loaded = true;
    return route.fulfill({ contentType: 'application/javascript', body: `window.BookingToolIframe = { initialize(options) {
      const iframe = document.createElement('iframe'); iframe.src = '/faq';
      document.querySelector(options.target).appendChild(iframe);
    } };` });
  });
  await page.goto('/buchen');
  expect(loaded).toBe(false);
  await page.getByRole('button', { name: 'Buchungsformular laden' }).click();
  await expect(page.locator('iframe[title="Smoobu – Unterkunft auswählen und buchen"]')).toBeVisible();
  await expect(page).toHaveURL(/\/buchen$/);
  expect(loaded).toBe(true);
});

test('booking reports a failed provider script without redirecting or claiming confirmation', async ({ page }) => {
  await page.route('https://login.smoobu.com/js/Settings/BookingToolIframe.js', route => route.abort());
  await page.goto('/buchen');
  await page.getByRole('button', { name: 'Buchungsformular laden' }).click();
  await expect(page.getByRole('heading', { name: 'Buchungsformular nicht erreichbar' })).toBeVisible();
  await expect(page).toHaveURL(/\/buchen$/);
});

test('unconfigured CMS rejects API reads, writes and first-user registration', async ({ request }) => {
  for (const path of ['/api/cms/support-topics', '/api/cms/admins/first-register']) {
    expect((await request.get(path)).status()).toBe(503);
    expect((await request.post(path, { data: {} })).status()).toBe(503);
  }
});
