// usage: node tools/shot.mjs "<query>" out.png [w] [h]   (server must run on :8123)
import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
const [, , query = '', out = 'shot.png', w = '900', h = '700'] = process.argv;
const browser = await chromium.launch({ executablePath: '/home/claude/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
const logs = []; page.on('console', m => logs.push(m.type() + ': ' + m.text())); page.on('pageerror', e => logs.push('PAGEERROR: ' + e.message));
await page.goto('http://localhost:8123/index.html?' + query);
await page.waitForFunction(() => window.__frames > 3, null, { timeout: 15000 }).catch(() => logs.push('TIMEOUT waiting for frames'));
await page.waitForTimeout(500);
await page.screenshot({ path: out });
console.log(logs.slice(0, 15).join('\n') || 'no console output');
await browser.close();
