# Color Generator

一个简洁的随机颜色生成器，部署在 Cloudflare Workers 上。

## 功能特性

- 🎨 随机生成美观的颜色
- 🖱️ 点击页面生成新颜色
- 📱 响应式设计
- ⚡ 基于 Cloudflare Workers 的快速部署
- 🔒 安全的 CSP 策略

## 技术栈

- **运行时**: Cloudflare Workers
- **语言**: TypeScript
- **包管理**: pnpm
- **部署**: GitHub Actions + Wrangler

## 开发

```bash
# 安装依赖
pnpm install

# 本地开发
pnpm dev

# 类型检查
pnpm typecheck

# 部署
pnpm deploy
```

## 项目结构

```
├── src/           # 源代码
├── docs/          # 文档
├── scripts/       # 构建脚本
├── tests/         # 测试文件
├── public/        # 静态资源
└── .github/       # GitHub Actions
```

## 许可证

MIT
