export const prerender = true;
export function GET() {
	const site = import.meta.env.PUBLIC_SITE_URL?.replace(/\/$/, '');
	const body = site ? `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${site}/</loc></url></urlset>` : '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';
	return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
