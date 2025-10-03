# 开发指南

## 环境要求

- Node.js >= 22.0.0
- pnpm >= 10.17.0

## 本地开发

```bash
# 启动开发服务器
pnpm dev

# 访问 http://localhost:8787
```

## 部署

项目使用 GitHub Actions 自动部署到 Cloudflare Workers。

### 手动部署

```bash
pnpm deploy
```

## 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 提交信息使用英文，不超过8个单词
