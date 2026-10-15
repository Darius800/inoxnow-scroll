import type { Scene } from '../data/scenes';
import { createSpatialTransition, type BridgeConfig } from './spatial-transition';

type RuntimeScene = Scene & {
	image: HTMLImageElement;
	video?: HTMLVideoElement;
	objectUrl?: string;
	aborter?: AbortController;
	loading: boolean;
	ready: boolean;
	failed: boolean;
	target: number;
	current: number;
};

type Segment = { kind: 'scene' | 'bridge'; index: number; start: number; end: number; weight: number };

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function mountScrollWorld(root: HTMLElement) {
	const sceneData = JSON.parse(root.dataset.scenes || '[]') as Scene[];
	const bridges = JSON.parse(root.dataset.bridges || '[]') as BridgeConfig[];
	const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
	const listenerController = new AbortController();
	const mediaLayer = root.querySelector<HTMLElement>('.media-layer');
	const canvas = root.querySelector<HTMLCanvasElement>('.bridge-canvas');
	const bridgeFallback = root.querySelector<HTMLImageElement>('.bridge-fallback');
	const track = root.querySelector<HTMLElement>('.world-track');
	const progress = root.querySelector<HTMLElement>('.world-progress');
	const progressFill = root.querySelector<HTMLElement>('.world-progress i');
	const status = root.querySelector<HTMLElement>('.media-status');
	const cue = root.querySelector<HTMLElement>('.scroll-cue');
	const stage = root.querySelector<HTMLElement>('.world-stage');
	const copyLayer = root.querySelector<HTMLElement>('.scene-copy-layer');
	const rail = root.querySelector<HTMLElement>('.scene-rail');
	if (!mediaLayer || !canvas || !bridgeFallback || !track || !progress || !progressFill || !stage || !copyLayer || !rail) return;

	if (reduced) {
		root.classList.add('is-reduced');
		setupChrome(() => {});
		addEventListener('pagehide', () => listenerController.abort(), { once: true, signal: listenerController.signal });
		return;
	}

	const scenes: RuntimeScene[] = sceneData.map((scene, index) => {
		const image = new Image();
		image.className = 'scene-poster';
		image.src = scene.poster;
		image.alt = '';
		image.decoding = 'async';
		image.loading = index === 0 ? 'eager' : 'lazy';
		image.fetchPriority = index === 0 ? 'high' : 'auto';
		image.style.setProperty('--object-position', scene.objectPosition);
		mediaLayer.append(image);
		return { ...scene, image, loading: false, ready: false, failed: false, target: 0, current: 0 };
	});

	let segments: Segment[] = [];
	let totalDistance = 0;
	let activeSegment = -1;
	let activeScene = -1;
	let lastWidth = innerWidth;
	let ticking = false;
	let renderGeneration = 0;
	let currentBridgeIndex = -1;
	let currentTransition: Awaited<ReturnType<typeof createSpatialTransition>> | undefined;
	let destroyed = false;

	function layout() {
		let cursor = 0;
		segments = [];
		scenes.forEach((scene, index) => {
			const sceneDistance = scene.scrollWeight * innerHeight;
			segments.push({ kind: 'scene', index, start: cursor, end: cursor + sceneDistance, weight: scene.scrollWeight });
			cursor += sceneDistance;
			if (index < bridges.length) {
				const bridgeDistance = 0.82 * innerHeight;
				segments.push({ kind: 'bridge', index, start: cursor, end: cursor + bridgeDistance, weight: 0.82 });
				cursor += bridgeDistance;
			}
		});
		totalDistance = cursor;
		track.style.height = `${totalDistance + innerHeight}px`;
		requestRender();
	}

	async function loadScene(index: number) {
		const scene = scenes[index];
		if (!scene || scene.loading || scene.ready || scene.failed) return;
		scene.loading = true;
		scene.aborter = new AbortController();
		try {
			const response = await fetch(scene.clip, { signal: scene.aborter.signal });
			if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
			const blob = await response.blob();
			if (destroyed) return;
			scene.objectUrl = URL.createObjectURL(blob);
			const video = document.createElement('video');
			video.className = 'scene-video';
			video.muted = true;
			video.playsInline = true;
			video.preload = 'auto';
			video.dataset.scene = scene.id;
			video.setAttribute('muted', '');
			video.setAttribute('playsinline', '');
			video.style.setProperty('--object-position', scene.objectPosition);
			video.src = scene.objectUrl;
			mediaLayer.append(video);
			scene.video = video;
			await new Promise<void>((resolve, reject) => {
				video.addEventListener('loadedmetadata', () => resolve(), { once: true });
				video.addEventListener('error', () => reject(new Error(`No se pudo decodificar ${scene.id}`)), { once: true });
			});
			scene.ready = true;
			scene.loading = false;
			requestRender();
		} catch (error) {
			scene.loading = false;
			if (error instanceof Error && error.name === 'AbortError') return;
			scene.failed = true;
			if (status) status.textContent = `La animación de ${scene.label} no pudo cargarse. Se muestra su imagen.`;
			console.error(`Escena ${scene.id}`, error);
		}
	}

	function releaseScene(index: number) {
		const scene = scenes[index];
		if (!scene) return;
		scene.aborter?.abort();
		scene.video?.remove();
		if (scene.objectUrl) URL.revokeObjectURL(scene.objectUrl);
		scene.video = undefined; scene.objectUrl = undefined; scene.aborter = undefined;
		scene.ready = false; scene.loading = false; scene.current = 0;
	}

	function manageResources(sceneIndex: number) {
		for (let index = 0; index < scenes.length; index += 1) {
			if (Math.abs(index - sceneIndex) <= 1) void loadScene(index);
			else if (Math.abs(index - sceneIndex) > 2 && (scenes[index].video || scenes[index].loading)) releaseScene(index);
		}
	}

	async function renderBridge(index: number, local: number, generation: number) {
		bridgeFallback.classList.remove('is-visible');
		try {
			if (currentBridgeIndex !== index || !currentTransition) {
				currentTransition?.destroy();
				currentTransition = undefined;
				currentBridgeIndex = index;
				const transition = await createSpatialTransition(canvas, bridges[index]);
				if (generation !== renderGeneration || destroyed || activeSegment !== index * 2 + 1) { transition.destroy(); return; }
				currentTransition = transition;
			}
			if (generation === renderGeneration) currentTransition.render(local);
		} catch (error) {
			console.error(`Transición ${bridges[index].id}`, error);
			bridgeFallback.src = bridges[index].fallback;
			bridgeFallback.classList.add('is-visible');
		}
	}

	function setActiveScene(index: number) {
		if (index === activeScene) return;
		activeScene = index;
		if (status) status.textContent = scenes[index].failed ? `La animación de ${scenes[index].label} no pudo cargarse. Se muestra su imagen.` : '';
		root.style.setProperty('--accent', scenes[index].accent);
		root.querySelectorAll<HTMLElement>('[data-scene-link]').forEach((element) => element.toggleAttribute('aria-current', Number(element.dataset.sceneLink) === index));
		document.querySelectorAll<HTMLElement>('[data-nav-group]').forEach((element) => element.toggleAttribute('aria-current', element.dataset.navGroup === scenes[index].navGroup));
		manageResources(index);
	}

	function render() {
		ticking = false;
		const generation = ++renderGeneration;
		const y = clamp(scrollY - root.offsetTop, 0, totalDistance);
		const overall = totalDistance ? y / totalDistance : 0;
		let segmentIndex = segments.findIndex((segment) => y < segment.end);
		if (segmentIndex < 0) segmentIndex = segments.length - 1;
		const segment = segments[segmentIndex];
		if (!segment) return;
		activeSegment = segmentIndex;
		const local = clamp((y - segment.start) / (segment.end - segment.start));
		const sceneIndex = segment.kind === 'scene' ? segment.index : (local < 0.5 ? segment.index : segment.index + 1);
		setActiveScene(sceneIndex);
		const inside = scrollY >= root.offsetTop - 2 && scrollY < root.offsetTop + root.offsetHeight;
		root.classList.toggle('is-active', inside);
		stage.classList.toggle('show-bridge', segment.kind === 'bridge');
		mediaLayer.querySelectorAll<HTMLElement>('.scene-poster,.scene-video').forEach((element) => element.classList.remove('is-visible'));
		root.querySelectorAll<HTMLElement>('[data-scene-copy]').forEach((copy, index) => {
			const selected = index === sceneIndex;
			copy.classList.toggle('is-visible', selected);
			copy.setAttribute('aria-hidden', String(!selected));
		});

		if (segment.kind === 'scene') {
			const scene = scenes[segment.index];
			scene.image.classList.add('is-visible');
			if (scene.ready && scene.video) {
				scene.video.classList.add('is-visible');
				scene.target = local;
			}
		} else void renderBridge(segment.index, local, generation);

		progressFill.style.transform = `scaleX(${overall})`;
		progress.setAttribute('aria-valuenow', String(Math.round(overall * 100)));
		if (cue) cue.style.opacity = String(clamp(1 - y / (innerHeight * 0.45)));
		document.documentElement.dataset.scrollWorldReady = 'true';
	}

	function animate() {
		for (const scene of scenes) {
			if (!scene.ready || !scene.video || !scene.video.classList.contains('is-visible') || scene.video.seeking) continue;
			scene.current += (scene.target - scene.current) * 0.24;
			const targetTime = clamp(scene.current, 0, 0.995) * scene.video.duration;
			if (Math.abs(scene.video.currentTime - targetTime) > 0.012) {
				try { scene.video.currentTime = targetTime; } catch { /* metadata race */ }
			}
		}
		if (!destroyed) requestAnimationFrame(animate);
	}

	function jumpToScene(index: number) {
		const target = segments.find((segment) => segment.kind === 'scene' && segment.index === index);
		if (!target) return;
		scrollTo({ top: root.offsetTop + target.start + (target.end - target.start) * 0.32, behavior: 'smooth' });
	}

	function requestRender() { if (!ticking) { ticking = true; requestAnimationFrame(render); } }
	function onResize() { if (innerWidth === lastWidth) return; lastWidth = innerWidth; layout(); }
	function destroy() {
		if (destroyed) return;
		destroyed = true;
		listenerController.abort();
		removeEventListener('scroll', requestRender); removeEventListener('resize', onResize); removeEventListener('pagehide', destroy);
		currentTransition?.destroy(); scenes.forEach((_, index) => releaseScene(index));
	}

	function setupChrome(jump: (index: number) => void) {
		document.querySelectorAll<HTMLElement>('[data-scene-link]').forEach((element) => element.addEventListener('click', () => {
			const index = Number(element.dataset.sceneLink);
			if (reduced) document.querySelector(`#reducida-${sceneData[index].id}`)?.scrollIntoView({ behavior: 'auto' }); else jump(index);
			closeMenu();
		}, { signal: listenerController.signal }));
		const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
		const menu = document.querySelector<HTMLElement>('.mobile-menu');
		const closeMenu = () => { toggle?.setAttribute('aria-expanded', 'false'); toggle?.setAttribute('aria-label', 'Abrir menú'); menu?.setAttribute('aria-hidden', 'true'); document.body.classList.remove('menu-open'); };
		toggle?.addEventListener('click', () => {
			const opening = toggle.getAttribute('aria-expanded') !== 'true';
			toggle.setAttribute('aria-expanded', String(opening)); toggle.setAttribute('aria-label', opening ? 'Cerrar menú' : 'Abrir menú');
			menu?.setAttribute('aria-hidden', String(!opening)); document.body.classList.toggle('menu-open', opening);
		}, { signal: listenerController.signal });
		menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu, { signal: listenerController.signal }));
		addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); }, { signal: listenerController.signal });
	}

	setupChrome(jumpToScene);
	addEventListener('scroll', requestRender, { passive: true });
	addEventListener('resize', onResize, { passive: true });
	addEventListener('pagehide', destroy, { once: true });
	layout();
	void loadScene(0);
	requestAnimationFrame(animate);
	(window as typeof window & { __INOXNOW__?: unknown }).__INOXNOW__ = { jumpToScene, destroy, getState: () => ({ activeScene, activeSegment, ready: scenes.map((scene) => scene.ready), failed: scenes.map((scene) => scene.failed) }) };
}
