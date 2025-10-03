# 部署指南

## 自动部署

项目配置了 GitHub Actions，当代码推送到 `main` 分支时会自动部署。

### 配置 Secrets

在 GitHub 仓库设置中添加以下 Secrets：

- `CLOUDFLARE_API_TOKEN`: Cloudflare API Token
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare Account ID

## 手动部署

```bash
pnpm deploy
```

## 本地测试

```bash
pnpm dev
```

访问 http://localhost:8787 查看效果。
