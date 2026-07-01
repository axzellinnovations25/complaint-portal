const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();

  const pages = [
    { path: '/', name: 'home' },
    { path: '/submit', name: 'submit' },
    { path: '/services', name: 'services' },
    { path: '/notices', name: 'notices' },
  ];

  for (const p of pages) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const pg = await ctx.newPage();
    await pg.goto('http://localhost:5174' + p.path);
    await pg.waitForLoadState('networkidle');
    await pg.locator('.language-switcher button').last().click();
    await pg.waitForTimeout(600);
    await pg.screenshot({ path: `ta-${p.name}.png`, fullPage: true });
    console.log(`TA ${p.name} done`);
    await ctx.close();
  }

  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
