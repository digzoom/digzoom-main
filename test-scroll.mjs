import { chromium } from 'playwright';
import { join } from 'path';
import fs from 'fs';

const outDir = '/mnt/agents/output/scroll-test';
fs.mkdirSync(outDir, { recursive: true });

const SERVER = 'https://lwxkzwbptapks.ok.kimi.link';
const browser = await chromium.launch({ headless: true });

// Test 1: Home bottom → About
console.log('=== Test 1: Home (bottom) → About ===');
const ctx1 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p1 = await ctx1.newPage();
await p1.goto(SERVER + '/#/');
await p1.waitForTimeout(2000);
await p1.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await p1.waitForTimeout(500);
console.log('  Home bottom scroll:', await p1.evaluate(() => window.scrollY));
await p1.click('a[href="#/about"]');
await p1.waitForTimeout(2000);
const s1 = await p1.evaluate(() => window.scrollY);
console.log('  About scroll after nav:', s1, s1 < 100 ? '✅ PASS' : '❌ FAIL');
await p1.screenshot({ path: join(outDir, '01-home-to-about.png') });
await ctx1.close();

// Test 2: About bottom → Privacy (navigate via URL)
console.log('\n=== Test 2: About (bottom) → Privacy ===');
const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p2 = await ctx2.newPage();
await p2.goto(SERVER + '/#/about');
await p2.waitForTimeout(2000);
await p2.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await p2.waitForTimeout(500);
console.log('  About bottom scroll:', await p2.evaluate(() => window.scrollY));
await p2.goto(SERVER + '/#/privacy');
await p2.waitForTimeout(2000);
const s2 = await p2.evaluate(() => window.scrollY);
console.log('  Privacy scroll after nav:', s2, s2 < 100 ? '✅ PASS' : '❌ FAIL');
await p2.screenshot({ path: join(outDir, '02-about-to-privacy.png') });
await ctx2.close();

// Test 3: Privacy bottom → Home
console.log('\n=== Test 3: Privacy (bottom) → Home ===');
const ctx3 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p3 = await ctx3.newPage();
await p3.goto(SERVER + '/#/privacy');
await p3.waitForTimeout(2000);
await p3.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await p3.waitForTimeout(500);
console.log('  Privacy bottom scroll:', await p3.evaluate(() => window.scrollY));
await p3.goto(SERVER + '/#/');
await p3.waitForTimeout(2000);
const s3 = await p3.evaluate(() => window.scrollY);
console.log('  Home scroll after nav:', s3, s3 < 100 ? '✅ PASS' : '❌ FAIL');
await p3.screenshot({ path: join(outDir, '03-privacy-to-home.png') });
await ctx3.close();

await browser.close();
console.log('\nAll screenshots saved to:', outDir);
