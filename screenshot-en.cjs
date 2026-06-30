const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const pg = await ctx.newPage();
  await pg.goto('http://localhost:5174');
  await pg.waitForLoadState('networkidle');
  await pg.screenshot({ path: 'mobile-en.png', fullPage: true });
  console.log('English screenshot done');
  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
