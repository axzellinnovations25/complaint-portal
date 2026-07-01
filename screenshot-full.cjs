const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();

  const ctx1 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const pg1 = await ctx1.newPage();
  await pg1.goto('http://localhost:5174');
  await pg1.waitForLoadState('networkidle');
  await pg1.screenshot({ path: 'full-en.png', fullPage: true });
  console.log('EN full done');

  const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const pg2 = await ctx2.newPage();
  await pg2.goto('http://localhost:5174');
  await pg2.waitForLoadState('networkidle');
  await pg2.locator('.language-switcher button').last().click();
  await pg2.waitForTimeout(600);
  await pg2.screenshot({ path: 'full-ta.png', fullPage: true });
  console.log('TA full done');

  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
