export const prerender = true;
export function GET() {
	const site = import.meta.env.PUBLIC_SITE_URL?.replace(/\/$/, '');
	const body = ['User-agent: *', 'Allow: /', site ? `Sitemap: ${site}/sitemap.xml` : ''].filter(Boolean).join('\n');
	return new Response(`${body}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
