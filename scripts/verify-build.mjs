import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const html = fs.readFileSync(path.join(root, 'dist', 'index.html'), 'utf8');
const sceneIds = ['almacen', 'showroom', 'expedicion', 'espacio', 'instalacion', 'cocina'];
const bridgeIds = ['01-02', '02-03', '03-04', '04-05', '05-06'];

assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, 'Debe existir un único H1');
assert.match(html, /<meta name="description"/);
assert.match(html, /property="og:title"/);
assert.match(html, /data-contact-form/);
assert.doesNotMatch(html, /href="#"/);
sceneIds.forEach((id) => assert.match(html, new RegExp(`escena-${id}`), `Falta la escena ${id}`));
bridgeIds.forEach((id) => assert.match(html, new RegExp(id), `Falta el puente ${id}`));

const assets = [
	...Array.from({ length: 6 }, (_, index) => `public/media/videos/scene-0${index + 1}.mp4`),
	...Array.from({ length: 6 }, (_, index) => `public/media/posters/scene-0${index + 1}-${['warehouse', 'showroom', 'expedition', 'empty-kitchen', 'installation', 'operational-kitchen'][index]}.webp`),
];
assets.forEach((asset) => assert.ok(fs.existsSync(path.join(root, asset)), `Falta ${asset}`));

const mediaManifest = JSON.parse(fs.readFileSync(path.join(root, 'public', 'media', 'videos', 'manifest.json'), 'utf8'));
assert.equal(mediaManifest.length, 6, 'El manifiesto web debe contener seis vídeos');
mediaManifest.forEach((video, index) => {
	assert.equal(video.file, `scene-0${index + 1}.mp4`);
	assert.equal(video.videoCodec, 'h264');
	assert.equal(video.width, 1920);
	assert.equal(video.height, 1080);
	assert.equal(video.audioStreams, 0);
	assert.equal(video.gop, 8);
	assert.equal(video.faststart, true);
});

console.log('OK: 6 escenas, 5 puentes, SEO, contacto y derivados web verificados.');
