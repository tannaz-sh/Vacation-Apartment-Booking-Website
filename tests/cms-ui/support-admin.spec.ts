import { test, expect, type Page } from '@playwright/test';

// Selectors for Payload controls are based on the installed 3.94.1 UI source.
// All mutations below are performed through the real admin forms, not mocked APIs.
async function save(page: Page, draft = false) {
  const response = page.waitForResponse(response =>
    response.url().includes('/api/cms/support-topics') &&
    ['POST', 'PATCH'].includes(response.request().method()));
  await page.locator(draft ? '#action-save-draft' : '#action-save').click();
  expect((await response).ok()).toBe(true);
}

async function openHelp(page: Page, path: string) {
  await page.goto(path);
  await page.getByRole('button', { name: 'Hilfe öffnen', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  return dialog;
}

test('admin manages a topic and guests see only the published page-specific answers', async ({ page, browser }, testInfo) => {
  const { CMS_TEST_EMAIL: email, CMS_TEST_PASSWORD: password, CMS_TEST_PREFIX: prefix } = process.env;
  if (!email || !password || !prefix) throw new Error('Run through pnpm test:cms:ui with an isolated test database.');
  const title = `${prefix} ${testInfo.project.name}`;
  const question = 'Synthetische Testfrage – keine Gästeinformation?';
  const answer = 'Nur ein Entwicklungstest. Keine freigegebene Gästeinformation. '.repeat(35).trim();
  const revisedAnswer = 'Geänderte Testantwort – keine Gästeinformation.';
  const guestContext = await browser.newContext({ baseURL: 'http://127.0.0.1:5144',
    viewport: testInfo.project.use.viewport, isMobile: testInfo.project.use.isMobile,
    hasTouch: testInfo.project.use.hasTouch });
  const guest = await guestContext.newPage();
  try {
    await test.step('Log in and create a private draft using the admin form', async () => {
      await page.goto('/admin/login');
      await page.locator('input[name="email"]').fill(email);
      await page.locator('input[name="password"]').fill(password);
      await page.getByRole('button', { name: 'Anmelden', exact: true }).click();
      await expect(page).toHaveURL(/\/admin\/?$/);
      await page.goto('/admin/collections/support-topics/create');
      await page.locator('#field-title').fill(title);
      await page.locator('#field-page').getByRole('combobox').click();
      await page.getByRole('option', { name: 'Buchung', exact: true }).click();
      await page.locator('#field-section').fill('Testbereich');
      await page.getByRole('button', { name: 'Frage hinzufügen', exact: true }).click();
      await page.locator('#field-questions__0__question').fill(question);
      await page.locator('#field-questions__0__answer').fill(answer);
      await save(page, true);
      await expect(page).toHaveURL(/\/admin\/collections\/support-topics\/\d+$/);
      const help = await openHelp(guest, '/buchen');
      await expect(help.getByRole('button', { name: title })).toHaveCount(0);
    });

    await test.step('Publish, check guest Q&A, focus and long-text layout', async () => {
      await save(page);
      const help = await openHelp(guest, '/buchen');
      await help.getByRole('button', { name: `${title} Testbereich`, exact: true }).click();
      await expect(help.getByRole('heading', { name: title })).toBeFocused();
      await expect(help.getByText('Testbereich', { exact: true })).toBeVisible();
      await help.locator('summary', { hasText: question }).click();
      await expect(help.getByText(answer, { exact: true })).toBeVisible();
      const bounds = await help.boundingBox();
      const viewport = guest.viewportSize()!;
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.y).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport.width);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport.height);
      await expect(help.getByRole('button', { name: 'Hilfe schließen', exact: true })).toBeInViewport();
      await expect(help.getByRole('link', { name: 'Kontakt aufnehmen' })).toBeInViewport();
      await guest.keyboard.press('Escape');
      await expect(guest.getByRole('dialog')).toHaveCount(0);
      await expect(guest.getByRole('button', { name: 'Hilfe öffnen' })).toBeFocused();
      const elsewhere = await openHelp(guest, '/kontakt');
      await expect(elsewhere.getByRole('button', { name: title })).toHaveCount(0);
    });

    await test.step('Keep draft edits private until explicitly republished', async () => {
      await page.locator('#field-questions__0__answer').fill(revisedAnswer);
      await page.getByRole('button', { name: 'Frage hinzufügen', exact: true }).click();
      await page.locator('#field-questions__1__question').fill('Zweite synthetische Testfrage?');
      await page.locator('#field-questions__1__answer').fill('Wird im folgenden Schritt wieder entfernt.');
      await save(page, true);
      let help = await openHelp(guest, '/buchen');
      await help.getByRole('button', { name: `${title} Testbereich`, exact: true }).click();
      await help.locator('summary', { hasText: question }).click();
      await expect(help.getByText(answer, { exact: true })).toBeVisible();
      await expect(help.getByText(revisedAnswer, { exact: true })).toHaveCount(0);
      await save(page);
      help = await openHelp(guest, '/buchen');
      await help.getByRole('button', { name: `${title} Testbereich`, exact: true }).click();
      await help.locator('summary', { hasText: question }).click();
      await expect(help.getByText(revisedAnswer, { exact: true })).toBeVisible();
      await expect(help.locator('summary', { hasText: 'Zweite synthetische Testfrage?' })).toBeVisible();
      await help.getByRole('button', { name: 'Alle Themen' }).click();
      await expect(help.getByRole('button', { name: `${title} Testbereich`, exact: true })).toBeVisible();
      await help.getByRole('link', { name: 'Kontakt aufnehmen' }).click();
      await expect(guest).toHaveURL(/\/kontakt$/);
      await expect(guest.getByRole('dialog')).toHaveCount(0);
      await guest.goto('/faq');
      await guest.locator('main summary', { hasText: question }).click();
      await expect(guest.locator('main').getByText(revisedAnswer, { exact: true })).toBeVisible();
    });

    await test.step('Remove an individual question without deleting the topic', async () => {
      await page.locator('#field-questions .array-actions__button').nth(1).click();
      await page.locator('.array-actions__remove').click();
      await expect(page.locator('#field-questions__1__question')).toHaveCount(0);
      await save(page);
      const help = await openHelp(guest, '/buchen');
      await help.getByRole('button', { name: `${title} Testbereich`, exact: true }).click();
      await expect(help.locator('summary', { hasText: question })).toBeVisible();
      await expect(help.locator('summary', { hasText: 'Zweite synthetische Testfrage?' })).toHaveCount(0);
    });

    await test.step('Unpublish and delete through the admin controls', async () => {
      await page.locator('.doc-controls__popup button').first().click();
      await page.locator('#action-unpublish').click();
      await page.locator('#confirm-action').click();
      await expect(page.getByText('Erfolgreich unveröffentlicht.', { exact: true })).toBeVisible();
      let help = await openHelp(guest, '/buchen');
      await expect(help.getByRole('button', { name: title })).toHaveCount(0);
      await page.locator('.doc-controls__popup button').first().click();
      await page.locator('#action-delete').click();
      await page.locator('#confirm-action').click();
      await expect(page).toHaveURL(/\/admin\/collections\/support-topics(?:\?.*)?$/);
      await expect(page.getByRole('link', { name: title, exact: true })).toHaveCount(0);
      help = await openHelp(guest, '/buchen');
      await expect(help.getByRole('button', { name: title })).toHaveCount(0);
    });
  } finally {
    await guestContext.close();
  }
});
