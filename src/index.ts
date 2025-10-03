import htmlContent from './index.html';

export default {
	async fetch(request: Request): Promise<Response> {
		const method = request.method.toUpperCase();

		if (method !== 'GET' && method !== 'HEAD') {
			return new Response('Method Not Allowed', {
				status: 405,
				headers: {
					Allow: 'GET, HEAD',
					'Content-Type': 'text/plain; charset=UTF-8',
				},
			});
		}

		const headers: Record<string, string> = {
			'Content-Type': 'text/html; charset=UTF-8',
			'Cache-Control': 'no-store',
			'X-Content-Type-Options': 'nosniff',
			'Referrer-Policy': 'no-referrer',
			'Content-Security-Policy':
				"default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; object-src 'none'; frame-ancestors 'none'",
		};

		if (method === 'HEAD') {
			return new Response(null, { headers });
		}

		return new Response(htmlContent, { headers });
	},
} satisfies ExportedHandler;
