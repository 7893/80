// 从旁边的 index.html 文件导入其原始内容，作为一个字符串
// 我们在 wrangler.toml 中定义了规则，所以这里不再需要 "?raw" 后缀
import htmlContent from './index.html';

export default {
    // 当 Worker 收到请求时，fetch 函数会被调用
    async fetch(request: Request): Promise<Response> {
        const method = request.method.toUpperCase();

        // 仅允许 GET/HEAD，其余方法返回 405
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
            // 明确禁用缓存，避免浏览器或边缘缓存旧页面
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff',
            'Referrer-Policy': 'no-referrer',
            // 允许内联脚本/样式与 data: favicon；禁止外联、对象、连接、嵌入
            'Content-Security-Policy':
                "default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; object-src 'none'; frame-ancestors 'none'",
        };

        // HEAD 请求仅返回头部
        if (method === 'HEAD') {
            return new Response(null, { headers });
        }

        // 返回导入的 HTML 字符串内容
        return new Response(htmlContent, { headers });
    },
} satisfies ExportedHandler;
