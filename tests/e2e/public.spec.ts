import { test, expect } from '@playwright/test';
test('German navigation, empty inventory and verified Smoobu booking link',async({page})=>{
 await page.goto('/'); await expect(page.locator('html')).toHaveAttribute('lang','de');
 await page.getByRole('link',{name:'Ferienwohnungen entdecken'}).click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('Ferienwohnungen in Winterberg');
 await expect(page.getByRole('status')).toContainText('vorbereitet');
 await page.goto('/buchen');
 const booking = page.getByRole('link',{name:'Smoobu-Buchungsportal öffnen'});
 await expect(booking).toHaveAttribute('href','https://booking.smoobu.com/9A1947006');
 await expect(page.getByText('Eine Buchung ist erst mit der Bestätigung',{exact:false})).toBeVisible();
 await expect(page.locator('body')).not.toContainText(/Kaufen|Verkaufen|Kaufpreis/);
});
test('FAQ never invents an answer',async({page})=>{
 await page.goto('/faq'); await page.getByLabel('Fragen durchsuchen').fill('Stornierung');
 await expect(page.getByText('Hierzu liegt noch keine freigegebene Antwort vor.',{exact:false})).toBeVisible();
});
test('contact browser validation and honest unavailable state',async({page})=>{
 await page.goto('/kontakt'); await page.getByRole('button',{name:'Nachricht senden'}).click();
 await expect(page.getByLabel('Name',{exact:true})).toBeFocused();
 await page.getByLabel('Name',{exact:true}).fill('Test Guest'); await page.getByLabel('E-Mail',{exact:true}).fill('guest@example.test');
 await page.getByLabel('Nachricht',{exact:true}).fill('This is a development test.');
 await page.getByRole('checkbox').check(); await page.getByRole('button',{name:'Nachricht senden'}).click();
 await expect(page.getByRole('status')).toContainText('nicht gesendet');
});
test('contact API rejects abuse and never claims delivery',async({request})=>{
 const headers={origin:'http://127.0.0.1:3000'};
 const data={name:'Test Guest',email:'guest@example.test',message:'This is a development test.',privacy:true,website:''};
 expect((await request.post('/api/kontakt',{data,headers})).status()).toBe(503);
 expect((await request.post('/api/kontakt',{data:{...data,website:'spam'},headers})).status()).toBe(400);
 expect((await request.post('/api/kontakt',{data,headers:{origin:'https://evil.example'}})).status()).toBe(403);
 expect((await request.post('/api/kontakt',{data:{...data,message:'x'.repeat(25000)},headers})).status()).toBe(413);
});
test('unknown pages have no accidental public access',async({page})=>{
 for(const path of ['/missing','/ferienwohnungen/missing']) {
  const response=await page.goto(path); expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading',{name:'Seite nicht gefunden'})).toBeVisible();
 }
});
test('Payload admin is available but requires established authentication',async({page})=>{
 const response=await page.goto('/admin'); expect(response?.status()).toBe(200);
 await expect(page.locator('input[type="email"]')).toBeVisible();
 await expect(page.getByLabel('New Password')).toBeVisible();
 await expect(page.getByLabel('Confirm Password')).toBeVisible();
});
test('responsive layout and keyboard skip link',async({page})=>{
 await page.goto('/'); await page.keyboard.press('Tab'); await expect(page.getByRole('link',{name:'Zum Inhalt'})).toBeFocused();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
 await page.screenshot({path:test.info().outputPath('home.png'),fullPage:true,scale:'css'});
 await page.goto('/kontakt'); expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('home capacity search and mobile navigation work',async({page})=>{
 await page.goto('/');
 await page.getByLabel('Gäste',{exact:true}).selectOption('4');
 await page.getByLabel('Ausstattung',{exact:true}).selectOption('Balkon');
 await page.getByRole('button',{name:'Unterkünfte finden'}).click();
 await expect(page).toHaveURL(/ferienwohnungen\?gaeste=4&ausstattung=Balkon/);
 await expect(page.getByLabel('Gäste',{exact:true})).toHaveValue('4');
 if((page.viewportSize()?.width ?? 1000)<700){
  await page.locator('summary').filter({hasText:'Menü'}).click();
  await page.getByRole('navigation',{name:'Mobile Navigation'}).getByRole('link',{name:'Über uns',exact:true}).click();
  await expect(page.getByRole('heading',{level:1})).toContainText('Persönlich. Regional.');
 }
});
test('all public routes omit sales messaging and unconfirmed prices',async({request})=>{
 for(const path of ['/','/ferienwohnungen','/ueber-uns','/kontakt','/faq','/buchen','/impressum','/datenschutz','/buchungsbedingungen']){
  const response=await request.get(path); expect(response.status()).toBe(200);
  expect(await response.text()).not.toMatch(/Kaufpreis|Immobilie verkaufen|Kaufen|Verkaufen|Notarvertrag|99\s*€|485\.000/);
 }
});

