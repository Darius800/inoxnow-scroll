export const spatialBridges = [
  { id: '01-02', from: '../keyframes/scene-01-internal-motion-end.png', to: '../keyframes/scene-02-internal-motion-start.png', preview: './bridge-01-02-preview.png' },
  { id: '02-03', from: '../keyframes/scene-02-internal-motion-end.png', to: '../keyframes/scene-03-corrected-start.png', preview: './bridge-02-03-preview.png' },
  { id: '03-04', from: '../keyframes/scene-03-corrected-end.png', to: '../keyframes/scene-04-internal-motion-start.png', preview: './bridge-03-04-preview.png' },
  { id: '04-05', from: '../keyframes/scene-04-internal-motion-end.png', to: '../keyframes/scene-05-installation-start.png', preview: './bridge-04-05-preview.png' },
  { id: '05-06', from: '../keyframes/scene-05-installation-end.png', to: '../keyframes/scene-06-internal-motion-start.png', preview: './bridge-05-06-preview.png' },
];

const BACKGROUND = '#f7f0e7';
const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load ${url}`));
    image.src = url;
  });
}

function removeBorderBackground(image, tolerance = 48) {
  const source = document.createElement('canvas');
  source.width = image.naturalWidth;
  source.height = image.naturalHeight;
  const ctx = source.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(image, 0, 0);

  const frame = ctx.getImageData(0, 0, source.width, source.height);
  const pixels = frame.data;
  const width = source.width;
  const height = source.height;
  const corners = [[1, 1], [width - 2, 1], [1, height - 2], [width - 2, height - 2]];
  const background = [0, 1, 2].map(channel => Math.round(
    corners.reduce((total, [x, y]) => total + pixels[(y * width + x) * 4 + channel], 0) / corners.length
  ));
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  const toleranceSquared = tolerance * tolerance;
  let head = 0;
  let tail = 0;

  function distanceSquared(index) {
    const offset = index * 4;
    const red = pixels[offset] - background[0];
    const green = pixels[offset + 1] - background[1];
    const blue = pixels[offset + 2] - background[2];
    return red * red + green * green + blue * blue;
  }

  function enqueue(index) {
    if (visited[index] || distanceSquared(index) > toleranceSquared) return;
    visited[index] = 1;
    queue[tail++] = index;
  }

  for (let x = 0; x < width; x += 1) {
    enqueue(x);
    enqueue((height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(y * width);
    enqueue(y * width + width - 1);
  }
  while (head < tail) {
    const index = queue[head++];
    const x = index % width;
    const y = Math.floor(index / width);
    if (x > 0) enqueue(index - 1);
    if (x + 1 < width) enqueue(index + 1);
    if (y > 0) enqueue(index - width);
    if (y + 1 < height) enqueue(index + width);
  }

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  for (let index = 0; index < visited.length; index += 1) {
    const offset = index * 4;
    if (visited[index]) {
      const distance = Math.sqrt(distanceSquared(index));
      pixels[offset + 3] = distance < 18 ? 0 : Math.round(255 * (distance - 18) / Math.max(1, tolerance - 18));
    }
    if (pixels[offset + 3] > 28) {
      const x = index % width;
      const y = Math.floor(index / width);
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  ctx.putImageData(frame, 0, 0);
  return { image, canvas: source, bounds: { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 } };
}

function drawAsset(ctx, asset, transform) {
  const { bounds } = asset;
  const width = bounds.width * transform.scale;
  const height = bounds.height * transform.scale;
  const x = transform.centerX - width / 2;
  const y = transform.centerY - height / 2;

  ctx.save();
  ctx.filter = `blur(${Math.max(8, 24 * transform.scale)}px)`;
  ctx.fillStyle = 'rgba(91, 70, 52, 0.12)';
  ctx.beginPath();
  ctx.ellipse(transform.centerX, y + height * 0.9, width * 0.3, Math.max(12, height * 0.035), 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.drawImage(asset.canvas, bounds.x, bounds.y, bounds.width, bounds.height, x, y, width, height);
}

export async function createSpatialTransition(canvas, bridge) {
  const ctx = canvas.getContext('2d');
  const [fromImage, toImage] = await Promise.all([loadImage(bridge.from), loadImage(bridge.to)]);
  const fromAsset = removeBorderBackground(fromImage);
  const toAsset = removeBorderBackground(toImage);

  function render(rawProgress) {
    const progress = clamp(rawProgress);
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (progress === 0) {
      ctx.drawImage(fromImage, 0, 0, canvas.width, canvas.height);
      return;
    }
    if (progress === 1) {
      ctx.drawImage(toImage, 0, 0, canvas.width, canvas.height);
      return;
    }

    const travel = smooth(progress);
    const fromBaseScale = canvas.width / fromImage.naturalWidth;
    const toBaseScale = canvas.width / toImage.naturalWidth;
    const fromOriginalCenterX = (fromAsset.bounds.x + fromAsset.bounds.width / 2) * fromBaseScale;
    const fromOriginalCenterY = (fromAsset.bounds.y + fromAsset.bounds.height / 2) * fromBaseScale;
    const toOriginalCenterX = (toAsset.bounds.x + toAsset.bounds.width / 2) * toBaseScale;
    const toOriginalCenterY = (toAsset.bounds.y + toAsset.bounds.height / 2) * toBaseScale;

    drawAsset(ctx, fromAsset, {
      scale: fromBaseScale * (1 - travel * 0.58),
      centerX: fromOriginalCenterX + (canvas.width * 0.26 - fromOriginalCenterX) * travel,
      centerY: fromOriginalCenterY + (canvas.height * 0.58 - fromOriginalCenterY) * travel,
    });
    drawAsset(ctx, toAsset, {
      scale: toBaseScale * (0.42 + travel * 0.58),
      centerX: canvas.width * 1.16 + (toOriginalCenterX - canvas.width * 1.16) * travel,
      centerY: canvas.height * 0.58 + (toOriginalCenterY - canvas.height * 0.58) * travel,
    });
  }

  return { render };
}
