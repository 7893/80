const ALLOWED_METHODS = new Set(['GET', 'HEAD']);
const ALLOW_HEADER_VALUE = 'GET, HEAD, OPTIONS';

const generateNonce = (): string => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const createSecurityHeaders = (initialHeaders?: Headers, nonce?: string): Headers => {
  const headers = initialHeaders || new Headers();
  headers.set('Cache-Control', 'no-store');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'no-referrer');
  headers.set('Permissions-Policy', 'interest-cohort=()');

  const csp = nonce
    ? `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'nonce-${nonce}'; img-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'`
    : "default-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'";

  headers.set('Content-Security-Policy', csp);
  return headers;
};

const renderHtml = (nonce: string): string => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>#000000</title>
    <link rel="icon" type="image/png" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHklEQVQ4T2NkYGD4z0ABYBw1gGE0DBhGw4BhWIQBAE5OEAELnjVHAAAAAElFTkSuQmCC">
    <style nonce="${nonce}">
      :root {
        --color: #000000;
        --color-transparent: #00000022;
      }

      ::selection {
        background: var(--color-transparent);
      }

      html,
      body {
        background: var(--color);
        height: 100%;
        margin: 0;
      }

      body {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transform: translate3d(0, 0, 0);
        will-change: transform;
        backface-visibility: hidden;
      }

      #color {
        background: white;
        color: var(--color);
        font-size: 2.5rem;
        font-weight: 300;
        padding: 2.25rem 3rem;
        font-family: -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif;
        cursor: text;
        transform: translate3d(0, 0, 0);
        will-change: color, background-color;
        backface-visibility: hidden;
      }
    </style>
  </head>

  <body>
    <p id="color">#000000</p>
    <script nonce="${nonce}">
      (() => {
        const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        const hslToHex = (h, s, l) => {
          const normalizedHue = h / 360;
          const normalizedSaturation = s / 100;
          const normalizedLightness = l / 100;

          if (normalizedSaturation === 0) {
            const value = Math.round(normalizedLightness * 255).toString(16).padStart(2, '0');
            return '#' + value + value + value;
          }

          const hue2rgb = (p, q, t) => {
            let value = t;
            if (value < 0) value += 1;
            if (value > 1) value -= 1;
            if (value < 1 / 6) return p + (q - p) * 6 * value;
            if (value < 1 / 2) return q;
            if (value < 2 / 3) return p + (q - p) * (2 / 3 - value) * 6;
            return p;
          };

          const q =
            normalizedLightness < 0.5
              ? normalizedLightness * (1 + normalizedSaturation)
              : normalizedLightness + normalizedSaturation - normalizedLightness * normalizedSaturation;
          const p = 2 * normalizedLightness - q;

          const r = hue2rgb(p, q, normalizedHue + 1 / 3);
          const g = hue2rgb(p, q, normalizedHue);
          const b = hue2rgb(p, q, normalizedHue - 1 / 3);

          const toHex = (value) => Math.round(value * 255).toString(16).padStart(2, '0');
          return '#' + toHex(r) + toHex(g) + toHex(b);
        };

        const setFavicon = (hex) => {
          const canvas = document.createElement('canvas');
          canvas.width = 16;
          canvas.height = 16;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return;
          }
          ctx.fillStyle = hex;
          ctx.fillRect(0, 0, 16, 16);
          const link = document.querySelector('link[rel="icon"]');
          if (link) {
            link.setAttribute('href', canvas.toDataURL('image/png'));
          }
        };

        window.addEventListener('load', () => {
          const colorElement = document.getElementById('color');
          if (!colorElement) {
            return;
          }

          const stopPropagation = (event) => event.stopPropagation();
          colorElement.addEventListener('click', stopPropagation, false);
          colorElement.addEventListener('mousedown', stopPropagation, false);

          const applyRandomColor = () => {
            const hue = randomInt(0, 359);
            const saturation = randomInt(55, 75);
            const lightness = randomInt(40, 60);

            document.documentElement.style.setProperty('--color', 'hsl(' + hue + ', ' + saturation + '%, ' + lightness + '%)');
            const hex = hslToHex(hue, saturation, lightness);
            document.title = hex;
            colorElement.textContent = hex;
            document.documentElement.style.setProperty('--color-transparent', hex + '22');

            setFavicon(hex);
          };

          const body = document.body;
          body.addEventListener('mousedown', (event) => {
            event.preventDefault();
          });
          body.addEventListener('click', applyRandomColor, false);

          applyRandomColor();
        });
      })();
    </script>
  </body>
</html>`;

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
