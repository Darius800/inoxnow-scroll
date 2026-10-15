# INOXNOW Scroll World

Landing corporativa en Astro con seis escenas audiovisuales y cinco transiciones espaciales 2.5D controladas por el progreso de scroll.

## Desarrollo local

```sh
pnpm install
pnpm astro dev --background
```

URL local: `http://localhost:4321/`

Gestiona el servidor en segundo plano con:

```sh
pnpm astro dev status
pnpm astro dev logs
pnpm astro dev stop
```

## Verificación

```sh
pnpm build
node scripts/verify-build.mjs
pnpm media:verify
```

La prueba de navegador requiere un Chromium con depuración remota en el puerto `9444`:

```sh
pnpm qa:browser
```

Los derivados web pueden regenerarse sin modificar los maestros con `pnpm media:encode`.
FFmpeg y FFprobe deben estar disponibles en `PATH`; en este entorno se instaló FFmpeg
9.0.2 mediante el paquete `Gyan.FFmpeg` de WinGet para el usuario actual.

## Producción

Define `PUBLIC_SITE_URL` con el origen definitivo, sin barra final, antes de compilar. Esa variable activa el canonical absoluto, `og:url` y la URL del sitemap en `robots.txt`.

Antes de publicar también hay que configurar un canal corporativo para el formulario, aportar los datos de contacto verificados y publicar el aviso legal y la política de privacidad.
