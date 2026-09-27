import { renderHtml } from './page';
import { generateNonce, createSecurityHeaders } from './security';

const ALLOWED_METHODS = new Set(['GET', 'HEAD']);
const ALLOW_HEADER_VALUE = 'GET, HEAD, OPTIONS';


export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === 'OPTIONS') {
      const headers = createSecurityHeaders();
      headers.set('Allow', ALLOW_HEADER_VALUE);
      return new Response(null, { status: 204, headers });
    }

    if (!ALLOWED_METHODS.has(request.method)) {
      const headers = createSecurityHeaders();
      headers.set('Allow', ALLOW_HEADER_VALUE);
      return new Response(null, { status: 405, statusText: 'Method Not Allowed', headers });
    }

    const nonce = generateNonce();
    const headers = createSecurityHeaders(new Headers({ 'Content-Type': 'text/html; charset=utf-8' }), nonce);
    const body = request.method === 'HEAD' ? null : renderHtml(nonce);

    return new Response(body, { status: 200, headers });
  },
};
