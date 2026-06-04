import { chromium } from 'playwright';
import { join } from 'path';
import fs from 'fs';

const outDir = '/mnt/agents/output/final-test';
fs.mkdirSync(outDir, { recursive: true });
const SERVER = 'https://lwxkzwbptapks.kimi.page';
const browser = await chromium.launch({ headless: true });

// Mobile Hero
console.log('1. Mobile Hero...');
const d1 = await browser.newContext({ viewport: { width: 375, height: 812 } });
const p1 = await d1.newPage();
await p1.goto(SERVER + '/#/');
await p1.waitForTimeout(2000);
await p1.screenshot({ path: join(outDir, '01-mobile-hero.png') });
await d1.close();

// Mobile 3 Pillars
console.log('2. Mobile 3 Pillars...');
const d2 = await browser.newContext({ viewport: { width: 375, height: 812 } });
const p2 = await d2.newPage();
await p2.goto(SERVER + '/#/');
await p2.waitForTimeout(1000);
await p2.evaluate(() => window.scrollTo(0, 1200));
await p2.waitForTimeout(500);
await p2.screenshot({ path: join(outDir, '02-mobile-pillars.png') });
await d2.close();

// Desktop Products
console.log('3. Desktop Products...');
const d3 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p3 = await d3.newPage();
await p3.goto(SERVER + '/#/');
await p3.waitForTimeout(1000);
await p3.evaluate(() => window.scrollTo(0, 1600));
await p3.waitForTimeout(500);
await p3.screenshot({ path: join(outDir, '03-desktop-products.png') });
await d3.close();

// Desktop Marketing
console.log('4. Desktop Marketing...');
const d4 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p4 = await d4.newPage();
await p4.goto(SERVER + '/#/');
await p4.waitForTimeout(1000);
await p4.evaluate(() => window.scrollTo(0, 3000));
await p4.waitForTimeout(500);
await p4.screenshot({ path: join(outDir, '04-desktop-marketing.png') });
await d4.close();

await browser.close();
console.log('Done:', outDir);
