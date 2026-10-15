import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const endpoint = process.env.QA_CDP_ENDPOINT || 'http://127.0.0.1:9444';
const pageUrl = process.env.QA_PAGE_URL || 'http://localhost:4321/';
const weights = [1.55, .82, 1.35, .82, 1.25, .82, 1.30, .82, 1.35, .82, 1.55];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function openTarget(url) {
	const target = await fetch(`${endpoint}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' }).then((response) => response.json());
	const ws = new WebSocket(target.webSocketDebuggerUrl);
	const pending = new Map();
	const events = [];
	let nextId = 1;
	await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
	ws.addEventListener('message', (event) => {
		const message = JSON.parse(event.data);
		if (message.id && pending.has(message.id)) {
			const task = pending.get(message.id); pending.delete(message.id);
			message.error ? task.reject(new Error(message.error.message)) : task.resolve(message.result);
		} else if (['Runtime.exceptionThrown', 'Log.entryAdded', 'Runtime.consoleAPICalled'].includes(message.method)) events.push(message);
	});
	const send = (method, params = {}) => new Promise((resolve, reject) => { const id = nextId++; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
	const evaluate = async (expression) => {
		const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
		if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
		return result.result?.value;
	};
	await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable');
	return { target, ws, send, evaluate, events };
}

async function screenshot(client, name) {
	const result = await client.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
	fs.writeFileSync(path.join(root, 'media', 'reports', name), Buffer.from(result.data, 'base64'));
}

async function waitReady(client) {
	for (let attempt = 0; attempt < 120; attempt += 1) {
		if (await client.evaluate("document.documentElement?.dataset.scrollWorldReady === 'true'")) return;
		await wait(100);
	}
	const diagnostic = await client.evaluate(`JSON.stringify({
		readyState: document.readyState,
		title: document.title,
		body: document.body?.innerText?.slice(0, 240),
		hasWorld: Boolean(document.querySelector('[data-scroll-world]')),
		scripts: [...document.scripts].map((script) => script.src || 'inline')
	})`);
	throw new Error(`La landing no alcanzó el estado listo: ${diagnostic}; eventos: ${JSON.stringify(client.events)}`);
}

async function waitForScene(client, index) {
	for (let attempt = 0; attempt < 100; attempt += 1) {
		const serialized = await client.evaluate("window.__INOXNOW__ ? JSON.stringify(window.__INOXNOW__.getState()) : null");
		if (!serialized) { await wait(100); continue; }
		const state = JSON.parse(serialized);
		if (state.ready[index] || state.failed[index]) return state;
		await wait(100);
	}
	const serialized = await client.evaluate("window.__INOXNOW__ ? JSON.stringify(window.__INOXNOW__.getState()) : null");
	return serialized ? JSON.parse(serialized) : null;
}

async function scrollSegment(client, segment, height) {
	const before = weights.slice(0, segment).reduce((sum, value) => sum + value, 0);
	const y = (before + weights[segment] * .5) * height;
	await client.evaluate(`scrollTo(0, ${y})`);
	await wait(segment % 2 ? 1200 : 650);
	return JSON.parse(await client.evaluate('JSON.stringify(window.__INOXNOW__.getState())'));
}

const desktop = await openTarget(pageUrl);
await desktop.send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 900, deviceScaleFactor: 1, mobile: false });
await desktop.evaluate("delete document.documentElement.dataset.scrollWorldReady");
await desktop.send('Page.reload', { ignoreCache: true });
await waitReady(desktop);
await desktop.evaluate("history.scrollRestoration = 'manual'; scrollTo(0, 0)"); await wait(300);
const report = { url: pageUrl, desktop: { forward: [], reverse: [], screenshots: [], video: [], consoleErrors: [] }, mobile: {}, reducedMotion: {} };
report.desktop.initialMedia = await waitForScene(desktop, 0);

for (let segment = 0; segment < 11; segment += 1) {
	const state = await scrollSegment(desktop, segment, 900);
	report.desktop.forward.push({ expected: segment, actual: state.activeSegment, activeScene: state.activeScene });
	if (segment === 0 || segment === 5 || segment === 10) {
		const name = `landing-desktop-segment-${String(segment + 1).padStart(2, '0')}.png`;
		await screenshot(desktop, name); report.desktop.screenshots.push(name);
	}
}
for (let segment = 10; segment >= 0; segment -= 1) {
	const state = await scrollSegment(desktop, segment, 900);
	report.desktop.reverse.push({ expected: segment, actual: state.activeSegment, activeScene: state.activeScene });
}
await desktop.evaluate('scrollTo(0, document.documentElement.scrollHeight)'); await wait(400);
const fastEnd = JSON.parse(await desktop.evaluate('JSON.stringify(window.__INOXNOW__.getState())'));
await desktop.evaluate('scrollTo(0, 0)'); await wait(400);
const fastStart = JSON.parse(await desktop.evaluate('JSON.stringify(window.__INOXNOW__.getState())'));
report.desktop.fastScroll = { end: fastEnd.activeSegment, start: fastStart.activeSegment };
await desktop.evaluate('window.__INOXNOW__.jumpToScene(5)'); await wait(1100);
await waitForScene(desktop, 5);
report.desktop.navigation = JSON.parse(await desktop.evaluate('JSON.stringify(window.__INOXNOW__.getState())'));
report.desktop.seekTimings = JSON.parse(await desktop.evaluate(`(async () => {
	const video = document.querySelector('.scene-video[data-scene="cocina"]');
	if (!video || !Number.isFinite(video.duration)) return JSON.stringify([]);
	video.classList.remove('is-visible');
	const timings = [];
	for (const ratio of [0.12, 0.86, 0.34]) {
		const started = performance.now();
		await new Promise((resolve) => {
			video.addEventListener('seeked', resolve, { once: true });
			video.currentTime = video.duration * ratio;
		});
		timings.push(Math.round((performance.now() - started) * 10) / 10);
	}
	video.classList.add('is-visible');
	return JSON.stringify(timings);
})()`));
report.desktop.video = JSON.parse(await desktop.evaluate(`JSON.stringify([...document.querySelectorAll('.scene-video')].map(video => ({blob:video.currentSrc.startsWith('blob:'),seekable:video.seekable.length ? video.seekable.end(0) : 0,paused:video.paused})))`));

await desktop.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await desktop.evaluate('scrollTo(0, 0)');
await desktop.evaluate("delete document.documentElement.dataset.scrollWorldReady");
await desktop.send('Page.reload', { ignoreCache: false }); await waitReady(desktop);
report.mobile.viewport = JSON.parse(await desktop.evaluate('JSON.stringify({innerWidth,innerHeight,devicePixelRatio})'));
report.mobile.menuBefore = JSON.parse(await desktop.evaluate(`JSON.stringify({
	button: Boolean(document.querySelector('.menu-toggle')),
	buttonDisplay: getComputedStyle(document.querySelector('.menu-toggle')).display,
	expanded: document.querySelector('.menu-toggle').getAttribute('aria-expanded'),
	hidden: document.querySelector('.mobile-menu').getAttribute('aria-hidden')
})`));
await desktop.evaluate("document.querySelector('.menu-toggle').click()"); await wait(250);
report.mobile.menuOpen = await desktop.evaluate("document.querySelector('.mobile-menu').getAttribute('aria-hidden') === 'false'");
report.mobile.menuAfter = JSON.parse(await desktop.evaluate(`JSON.stringify({
	expanded: document.querySelector('.menu-toggle').getAttribute('aria-expanded'),
	hidden: document.querySelector('.mobile-menu').getAttribute('aria-hidden'),
	bodyClass: document.body.className
})`));
await screenshot(desktop, 'landing-mobile-menu.png');
await desktop.evaluate("document.querySelector('.mobile-menu [data-scene-link=\"5\"]').click()"); await wait(1100);
await waitForScene(desktop, 5);
report.mobile.navigation = JSON.parse(await desktop.evaluate('JSON.stringify(window.__INOXNOW__.getState())'));
await screenshot(desktop, 'landing-mobile-scene-06.png');
await desktop.evaluate("document.querySelector('#contacto').scrollIntoView()"); await wait(500);
report.mobile.contactVisible = await desktop.evaluate("document.querySelector('#contacto').getBoundingClientRect().top < innerHeight");
await screenshot(desktop, 'landing-mobile-contact.png');
await desktop.evaluate("document.querySelector('[data-contact-form]').requestSubmit()");
report.mobile.formValidation = await desktop.evaluate("document.querySelector('[data-form-status]').textContent");

await desktop.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await desktop.evaluate("delete document.documentElement.dataset.scrollWorldReady");
await desktop.send('Page.reload', { ignoreCache: false }); await wait(500);
report.reducedMotion = JSON.parse(await desktop.evaluate(`JSON.stringify({reduced:document.querySelector('[data-scroll-world]').classList.contains('is-reduced'),videos:document.querySelectorAll('.scene-video').length,sections:document.querySelectorAll('.reduced-scene').length})`));
await screenshot(desktop, 'landing-mobile-reduced-motion.png');

report.desktop.consoleErrors = desktop.events.filter((event) => event.method === 'Runtime.exceptionThrown' || event.params?.entry?.level === 'error' || event.params?.type === 'error').map((event) => event.method);
assert.ok(report.desktop.forward.every((item) => item.expected === item.actual), 'El recorrido hacia delante perdió un segmento');
assert.ok(report.desktop.reverse.every((item) => item.expected === item.actual), 'El recorrido hacia atrás perdió un segmento');
assert.deepEqual(report.desktop.fastScroll, { end: 10, start: 0 }, 'El scroll rápido no alcanzó ambos extremos');
assert.equal(report.desktop.navigation.activeScene, 5, 'La navegación no alcanzó la escena 06');
assert.ok(report.desktop.video.length > 0 && report.desktop.video.every((video) => video.blob && video.seekable > 5), 'Los vídeos cargados no son plenamente seekable');
assert.equal(report.desktop.seekTimings.length, 3, 'No se pudieron medir tres seeks');
assert.equal(report.mobile.menuOpen, true, 'El menú móvil no se abrió');
assert.equal(report.mobile.navigation.activeScene, 5, 'La navegación móvil no alcanzó la escena 06');
assert.ok(report.mobile.navigation.failed.every((failed) => !failed), 'Una carga cancelada quedó marcada como fallo');
assert.equal(report.mobile.contactVisible, true, 'El contacto no quedó visible en móvil');
assert.match(report.mobile.formValidation, /Completa todos los campos/);
assert.deepEqual(report.reducedMotion, { reduced: true, videos: 0, sections: 6 });
assert.equal(report.desktop.consoleErrors.length, 0, 'Se registraron errores de consola');

const reportName = process.env.QA_REPORT_NAME || 'landing-qa-results.json';
fs.writeFileSync(path.join(root, 'media', 'reports', reportName), `${JSON.stringify(report, null, 2)}\n`);
desktop.ws.close(); await fetch(`${endpoint}/json/close/${desktop.target.id}`);
console.log(JSON.stringify(report, null, 2));
