export type BridgeConfig = { id: string; from: string; to: string; fallback: string };

type Asset = {
	canvas: HTMLCanvasElement;
	background: [number, number, number];
	bounds: { x: number; y: number; width: number; height: number };
};

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };

function loadImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.decoding = 'async';
		image.onload = () => resolve(image);
		image.onerror = () => reject(new Error(`No se pudo cargar ${url}`));
		image.src = url;
	});
}

function mixColour(a: number[], b: number[], amount: number) {
	const channels = a.map((value, index) => Math.round(value + (b[index] - value) * amount));
	return `rgb(${channels[0]} ${channels[1]} ${channels[2]})`;
}

function removeBorderBackground(image: HTMLImageElement, tolerance = 48): Asset {
	const source = document.createElement('canvas');
	source.width = image.naturalWidth;
	source.height = image.naturalHeight;
	const ctx = source.getContext('2d', { willReadFrequently: true });
	if (!ctx) throw new Error('Canvas 2D no disponible');
	ctx.drawImage(image, 0, 0);
	const frame = ctx.getImageData(0, 0, source.width, source.height);
	const pixels = frame.data;
	const width = source.width;
	const height = source.height;
	const corners = [[1, 1], [width - 2, 1], [1, height - 2], [width - 2, height - 2]];
	const background = [0, 1, 2].map((channel) => Math.round(corners.reduce((total, [x, y]) => total + pixels[(y * width + x) * 4 + channel], 0) / corners.length)) as [number, number, number];
	const visited = new Uint8Array(width * height);
	const queue = new Int32Array(width * height);
	const toleranceSquared = tolerance * tolerance;
	let head = 0;
	let tail = 0;
	const distanceSquared = (index: number) => {
		const offset = index * 4;
		return (pixels[offset] - background[0]) ** 2 + (pixels[offset + 1] - background[1]) ** 2 + (pixels[offset + 2] - background[2]) ** 2;
	};
	const enqueue = (index: number) => {
		if (visited[index] || distanceSquared(index) > toleranceSquared) return;
		visited[index] = 1;
		queue[tail++] = index;
	};
	for (let x = 0; x < width; x += 1) { enqueue(x); enqueue((height - 1) * width + x); }
	for (let y = 0; y < height; y += 1) { enqueue(y * width); enqueue(y * width + width - 1); }
	while (head < tail) {
		const index = queue[head++];
		const x = index % width;
		const y = Math.floor(index / width);
		if (x > 0) enqueue(index - 1);
		if (x + 1 < width) enqueue(index + 1);
		if (y > 0) enqueue(index - width);
		if (y + 1 < height) enqueue(index + width);
	}
	let minX = width, minY = height, maxX = 0, maxY = 0;
	for (let index = 0; index < visited.length; index += 1) {
		const offset = index * 4;
		if (visited[index]) {
			const distance = Math.sqrt(distanceSquared(index));
			pixels[offset + 3] = distance < 18 ? 0 : Math.round(255 * (distance - 18) / Math.max(1, tolerance - 18));
		}
		if (pixels[offset + 3] > 28) {
			const x = index % width;
			const y = Math.floor(index / width);
			minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
		}
	}
	ctx.putImageData(frame, 0, 0);
	return { canvas: source, background, bounds: { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 } };
}

function drawAsset(ctx: CanvasRenderingContext2D, asset: Asset, transform: { scale: number; centerX: number; centerY: number }) {
	const { bounds } = asset;
	const width = bounds.width * transform.scale;
	const height = bounds.height * transform.scale;
	const x = transform.centerX - width / 2;
	const y = transform.centerY - height / 2;
	ctx.save();
	ctx.filter = `blur(${Math.max(7, 22 * transform.scale)}px)`;
	ctx.fillStyle = 'rgba(91, 70, 52, 0.11)';
	ctx.beginPath();
	ctx.ellipse(transform.centerX, y + height * 0.9, width * 0.3, Math.max(12, height * 0.035), 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
	ctx.drawImage(asset.canvas, bounds.x, bounds.y, bounds.width, bounds.height, x, y, width, height);
}

export async function createSpatialTransition(canvas: HTMLCanvasElement, bridge: BridgeConfig) {
	const ctx = canvas.getContext('2d', { alpha: false });
	if (!ctx) throw new Error('Canvas 2D no disponible');
	const [fromImage, toImage] = await Promise.all([loadImage(bridge.from), loadImage(bridge.to)]);
	const fromAsset = removeBorderBackground(fromImage);
	const toAsset = removeBorderBackground(toImage);

	return {
		render(rawProgress: number) {
			const progress = clamp(rawProgress);
			if (progress === 0) { ctx.drawImage(fromImage, 0, 0, canvas.width, canvas.height); return; }
			if (progress === 1) { ctx.drawImage(toImage, 0, 0, canvas.width, canvas.height); return; }
			const travel = smooth(progress);
			ctx.fillStyle = mixColour(fromAsset.background, toAsset.background, travel);
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			const fromBaseScale = canvas.width / fromImage.naturalWidth;
			const toBaseScale = canvas.width / toImage.naturalWidth;
			const fromCenterX = (fromAsset.bounds.x + fromAsset.bounds.width / 2) * fromBaseScale;
			const fromCenterY = (fromAsset.bounds.y + fromAsset.bounds.height / 2) * fromBaseScale;
			const toCenterX = (toAsset.bounds.x + toAsset.bounds.width / 2) * toBaseScale;
			const toCenterY = (toAsset.bounds.y + toAsset.bounds.height / 2) * toBaseScale;
			drawAsset(ctx, fromAsset, { scale: fromBaseScale * (1 - travel * 0.58), centerX: fromCenterX + (canvas.width * 0.25 - fromCenterX) * travel, centerY: fromCenterY + (canvas.height * 0.58 - fromCenterY) * travel });
			drawAsset(ctx, toAsset, { scale: toBaseScale * (0.42 + travel * 0.58), centerX: canvas.width * 1.16 + (toCenterX - canvas.width * 1.16) * travel, centerY: canvas.height * 0.58 + (toCenterY - canvas.height * 0.58) * travel });
		},
		destroy() { fromAsset.canvas.width = 0; toAsset.canvas.width = 0; },
	};
}
