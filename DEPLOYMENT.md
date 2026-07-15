# 部署说明

## 构建

```bash
npm run build
```

构建产物在 `dist/` 目录。

## 部署方式

### 1. 静态服务器

```bash
cd dist && python -m http.server 8080
```

### 2. Nginx

配置 SPA 路由支持，将所有请求重定向到 index.html。

### 3. 微信环境

- 需要HTTPS
- 配置业务域名
- 已在 meta 中配置 apple-mobile-web-app-capable

## 二维码占位

分享海报中的二维码需要替换为实际游戏URL的二维码。
