// Post-hardening sweep: headers present? console clean under CSP?
const { chromium } = require('@playwright/test');

const SITES = [
  'https://aegis-ai.solutions',
  'https://awipartners.africa',
  'https://www.apricus-mu.com',
  'https://studio26.me',
  'https://mala-spices.ruben-ramdhony.workers.dev',
  'https://mala-ops.pages.dev',
  'https://life-os-cmd.pages.dev',
];

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  let failures = 0;
  for (const url of SITES) {
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 140)); });
    page.on('pageerror', e => errors.push(('pageerror: ' + e.message).slice(0, 140)));
    try {
      const res = await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(2500);
      const csp = res.headers()['content-security-policy'] ? 'CSP✓' : 'CSP✗';
      const xcto = res.headers()['x-content-type-options'] ? 'nosniff✓' : 'nosniff✗';
      const status = errors.length ? `ERRORS(${errors.length})` : 'clean';
      if (errors.length || csp === 'CSP✗') failures++;
      console.log(`${url} | ${res.status()} | ${csp} ${xcto} | ${status}`);
      errors.slice(0, 3).forEach(e => console.log(`    ! ${e}`));
    } catch (e) {
      failures++;
      console.log(`${url} | FAILED: ${e.message.slice(0, 100)}`);
    }
    await page.close();
  }
  await browser.close();
  process.exit(failures ? 1 : 0);
})();
