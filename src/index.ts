// 从旁边的 index.html 文件导入其原始内容，作为一个字符串
// 我们在 wrangler.toml 中定义了规则，所以这里不再需要 "?raw" 后缀
import htmlContent from './index.html';

export default {
    // 当 Worker 收到请求时，fetch 函数会被调用
    async fetch(request: Request): Promise<Response> {

        // 无论请求什么路径，都直接返回我们导入的 HTML 字符串内容
        return new Response(htmlContent, {
            headers: {
                'Content-Type': 'text/html;charset=UTF-8',
            },
        });
    },
};