import fs from 'node:fs';

const [wsUrl, outputPath] = process.argv.slice(2);
if (!wsUrl || !outputPath) throw new Error('Usage: node capture-frame-cdp.mjs <ws-url> <output.png>');

const ws = new WebSocket(wsUrl);
const pending = new Map();
let nextId = 1;

const opened = new Promise((resolve, reject) => {
  ws.addEventListener('open', resolve, { once: true });
  ws.addEventListener('error', reject, { once: true });
});

ws.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await opened;
await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', {
  width: 2560,
  height: 1440,
  deviceScaleFactor: 1,
  mobile: false,
});

let ready = false;
for (let attempt = 0; attempt < 40; attempt += 1) {
  const result = await send('Runtime.evaluate', {
    expression: 'document.title',
    returnByValue: true,
  });
  if (result.result?.value === 'frame-ready') {
    ready = true;
    break;
  }
  await new Promise(resolve => setTimeout(resolve, 250));
}

if (!ready) {
  const diagnostics = await send('Runtime.evaluate', {
    expression: `JSON.stringify({
      title: document.title,
      readyState: document.querySelector('video')?.readyState,
      currentTime: document.querySelector('video')?.currentTime,
      currentSrc: document.querySelector('video')?.currentSrc,
      networkState: document.querySelector('video')?.networkState,
      paused: document.querySelector('video')?.paused,
      ended: document.querySelector('video')?.ended,
      mediaError: document.querySelector('video')?.error?.message,
      captureError: window.captureError
    })`,
    returnByValue: true,
  });
  ws.close();
  throw new Error(`Timed out waiting for decoded video frame: ${diagnostics.result?.value}`);
}
const screenshot = await send('Page.captureScreenshot', {
  format: 'png',
  captureBeyondViewport: false,
});
fs.writeFileSync(outputPath, Buffer.from(screenshot.data, 'base64'));
ws.close();
process.exit(0);
