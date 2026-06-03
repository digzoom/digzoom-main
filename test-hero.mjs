import { chromium } from 'playwright';
import { join } from 'path';
import fs from 'fs';

const outDir = '/mnt/agents/output/hero-test';
fs.mkdirSync(outDir, { recursive: true });
const SERVER = 'https://lwxkzwbptapks.kimi.page';
const browser = await chromium.launch({ headless: true });

// Desktop Hero
console.log('1. Desktop Hero...');
const d1 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p1 = await d1.newPage();
await p1.goto(SERVER + '/#/');
await p1.waitForTimeout(2000);
await p1.screenshot({ path: join(outDir, '01-desktop-hero.png') });
await d1.close();

// Mobile Hero
console.log('2. Mobile Hero...');
const d2 = await browser.newContext({ viewport: { width: 375, height: 812 } });
const p2 = await d2.newPage();
await p2.goto(SERVER + '/#/');
await p2.waitForTimeout(2000);
await p2.screenshot({ path: join(outDir, '02-mobile-hero.png') });
await d2.close();

// Trust Section
console.log('3. Trust Section...');
const d3 = await browser.newContext({ viewport: { width: 1440, height: 600 } });
const p3 = await d3.newPage();
await p3.goto(SERVER + '/#/');
await p3.waitForTimeout(1000);
await p3.evaluate(() => window.scrollTo(0, 700));
await p3.waitForTimeout(500);
await p3.screenshot({ path: join(outDir, '03-trust-section.png') });
await d3.close();

// About
console.log('4. About...');
const d4 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p4 = await d4.newPage();
await p4.goto(SERVER + '/#/about');
await p4.waitForTimeout(2000);
await p4.screenshot({ path: join(outDir, '04-about.png') });
await d4.close();

// Footer
console.log('5. Footer...');
const d5 = await browser.newContext({ viewport: { width: 1440, height: 800 } });
const p5 = await d5.newPage();
await p5.goto(SERVER + '/#/');
await p5.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await p5.waitForTimeout(500);
await p5.screenshot({ path: join(outDir, '05-footer.png') });
await d5.close();

await browser.close();
console.log('Done:', outDir);
