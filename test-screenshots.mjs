import { chromium } from 'playwright';
import { join } from 'path';
import fs from 'fs';

const screenshotsDir = join(process.cwd(), 'test-screenshots');
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

const SERVER = 'http://localhost:8769';
const browser = await chromium.launch({ headless: true });

async function capture(name, viewport, pathSuffix = '', actions) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));
  
  await page.goto(`${SERVER}/${pathSuffix}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  if (actions) await actions(page);
  
  const path = join(screenshotsDir, `${name}-${viewport.width}x${viewport.height}.png`);
  await page.screenshot({ path, fullPage: false });
  await context.close();
  return { path, errors: errors.filter(e => !e.includes('net::ERR_CONNECTION_REFUSED') && !e.includes('trpc')) };
}

console.log('=== 1. LOGIN PAGE ===');
const loginD = await capture('login', { width: 1440, height: 900 }, '#/login');
console.log('  Desktop:', loginD.errors.length, 'errors');
const loginM = await capture('login-mobile', { width: 375, height: 812 }, '#/login');
console.log('  Mobile:', loginM.errors.length);
const loginI = await capture('login-ipad', { width: 768, height: 1024 }, '#/login');
console.log('  iPad:', loginI.errors.length);

console.log('\n=== 2. HOME PAGE ===');
const homeD = await capture('home', { width: 1440, height: 900 }, '');
console.log('  Desktop:', homeD.errors.length, 'errors', homeD.errors.slice(0, 5));
const homeM = await capture('home-mobile', { width: 375, height: 812 }, '');
console.log('  Mobile:', homeM.errors.length);

console.log('\n=== 3. CART PAGE ===');
const cartD = await capture('cart', { width: 1440, height: 900 }, '#/cart');
console.log('  Desktop:', cartD.errors.length, 'errors');
const cartM = await capture('cart-mobile', { width: 375, height: 812 }, '#/cart');
console.log('  Mobile:', cartM.errors.length);

console.log('\n=== 4. PERFORMANCE ===');
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.goto(SERVER + '/', { waitUntil: 'networkidle' });
await p.waitForTimeout(2000);
const perf = await p.evaluate(() => {
  const nav = performance.getEntriesByType('navigation')[0];
  return {
    domContentLoaded: Math.round(nav?.domContentLoadedEventEnd - nav?.startTime),
    loadComplete: Math.round(nav?.loadEventEnd - nav?.startTime),
    firstPaint: Math.round(performance.getEntriesByType('paint').find(p => p.name === 'first-paint')?.startTime),
    fcp: Math.round(performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime),
    jsHeap: Math.round(performance.memory?.usedJSHeapSize / 1024 / 1024),
  };
});
await ctx.close();
console.log('  Performance:', JSON.stringify(perf));

await browser.close();
console.log('\nAll screenshots saved to:', screenshotsDir);
