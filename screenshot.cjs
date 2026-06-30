const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();

  // Tamil mobile - use mobile menu to switch language
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const pg = await ctx.newPage();
  await pg.goto('http://localhost:5174');
  await pg.waitForLoadState('networkidle');
  // Open mobile menu
  await pg.click('.mobile-menu-toggle');
  await pg.waitForTimeout(400);
  // Click Tamil in mobile menu language switcher
  await pg.locator('.mobile-menu-language button').last().click();
  await pg.waitForTimeout(400);
  // Close menu by clicking the X button
  await pg.locator('.mobile-public-menu button[aria-label]').first().click();
  await pg.waitForTimeout(500);
  await pg.screenshot({ path: 'mobile-ta.png', fullPage: true });
  console.log('Tamil screenshot done');

  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
