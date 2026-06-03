import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

const allLogs = [];
page.on('console', msg => {
  allLogs.push({ type: msg.type(), text: msg.text() });
});
page.on('pageerror', err => {
  allLogs.push({ type: 'pageerror', text: err.message });
});
page.on('response', resp => {
  if (!resp.ok()) {
    allLogs.push({ type: 'http_error', text: `${resp.status()} ${resp.url()}` });
  }
});

await page.goto('http://localhost:8765/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

// Take screenshot of visible area
await page.screenshot({ path: '/mnt/agents/output/app/test-screenshots/home-debug.png' });

// Get page HTML
const html = await page.content();

console.log('=== CONSOLE LOGS ===');
for (const log of allLogs.slice(0, 20)) {
  console.log(`[${log.type}] ${log.text.substring(0, 150)}`);
}

console.log('\n=== HTML LENGTH ===', html.length);
console.log('=== BODY TEXT (first 500 chars) ===');
const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 500));
console.log(bodyText);

await browser.close();
