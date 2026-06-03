import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

// Set Arabic language in localStorage before page load
await page.goto('http://localhost:8771/');
await page.evaluate(() => {
  localStorage.setItem('digzoom-lang', 'ar');
});

// Reload to apply Arabic
await page.goto('http://localhost:8771/');
await page.waitForTimeout(2000);

// Click on "من نحن" link
const aboutLink = await page.locator('a[href="#/about"]').first();
if (await aboutLink.isVisible()) {
  await aboutLink.click();
} else {
  // Try mobile menu
  const menuBtn = await page.locator('button').filter({ hasText: '' }).first();
  if (await menuBtn.isVisible()) await menuBtn.click();
  await page.waitForTimeout(500);
  const aboutLink2 = await page.locator('a[href="#/about"]').first();
  if (await aboutLink2.isVisible()) await aboutLink2.click();
}

await page.waitForTimeout(3000);

// Check language - take screenshot
await page.screenshot({ path: '/mnt/agents/output/about-fix-test.png', fullPage: false });

// Get body text to check Arabic
const bodyText = await page.evaluate(() => document.body.innerText);
const hasArabicAbout = bodyText.includes('من نحن');
const hasArabicMission = bodyText.includes('رسالتنا');
const hasArabicVision = bodyText.includes('رؤيتنا');
const hasArabicWhatWeOffer = bodyText.includes('ماذا نقدم');
const hasArabicIdentity = bodyText.includes('هوية');

console.log('=== About Page Language Test ===');
console.log('Contains "من نحن":', hasArabicAbout);
console.log('Contains "رسالتنا":', hasArabicMission);
console.log('Contains "رؤيتنا":', hasArabicVision);
console.log('Contains "ماذا نقدم":', hasArabicWhatWeOffer);
console.log('Contains "هوية":', hasArabicIdentity);

// Check lang attribute
const htmlLang = await page.evaluate(() => document.documentElement.lang);
const htmlDir = await page.evaluate(() => document.documentElement.dir);
console.log('HTML lang:', htmlLang);
console.log('HTML dir:', htmlDir);

await browser.close();
