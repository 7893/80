
export const onRequest: PagesFunction = async ({ next }) => {
	const response = await next();

	if (!response.headers.has('Cache-Control')) {
		response.headers.set('Cache-Control', 'no-store');
	}
	if (!response.headers.has('X-Content-Type-Options')) {
		response.headers.set('X-Content-Type-Options', 'nosniff');
	}
	if (!response.headers.has('Referrer-Policy')) {
		response.headers.set('Referrer-Policy', 'no-referrer');
	}
	if (!response.headers.has('Content-Security-Policy')) {
		response.headers.set(
			'Content-Security-Policy',
			"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; object-src 'none'; frame-ancestors 'none'"
		);
	}

	return response;
};
