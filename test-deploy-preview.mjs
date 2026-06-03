import { chromium } from 'playwright';
import { join } from 'path';
import fs from 'fs';

const outDir = '/mnt/agents/output/deploy-screenshots';
fs.mkdirSync(outDir, { recursive: true });

const DEPLOY_URL = 'https://deploy-preview-1--digzoom-production.netlify.app';
const browser = await chromium.launch({ headless: true });

async function capture(name, viewport, path = '', actions) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  
  const url = DEPLOY_URL + (path ? '/#/' + path : '');
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);
  if (actions) await actions(page);
  
  const filePath = join(outDir, `${name}.png`);
  await page.screenshot({ path: filePath, fullPage: false });
  await context.close();
  return filePath;
}

console.log('1. Home Desktop...');
await capture('01-home-desktop', { width: 1440, height: 900 });

console.log('2. Home Mobile...');
await capture('02-home-mobile', { width: 375, height: 812 });

console.log('3. Login Desktop...');
await capture('03-login-desktop', { width: 1440, height: 900 }, 'login');

console.log('4. Login Mobile...');
await capture('04-login-mobile', { width: 375, height: 812 }, 'login');

console.log('5. Cart Desktop...');
await capture('05-cart-desktop', { width: 1440, height: 900 }, 'cart');

console.log('6. Cart with items...');
await capture('06-cart-items', { width: 1440, height: 900 }, 'cart', async (page) => {
  // Cart already has items from previous test
});

await browser.close();
console.log('Done! Screenshots in:', outDir);
