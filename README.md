# ProxyForge

ProxyForge 是一个轻量级的纯前端工具，旨在帮助用户将各种 Proxy 订阅链接（如 V2Ray, Shadowsocks 等）转换为 Clash 配置文件。

## 特性

- **隐私安全**：所有转换逻辑均在浏览器本地完成，不会向服务器发送您的订阅链接或敏感信息。
- **极速转换**：基于现代 Web 技术构建，实现秒级即时转换。
- **协议支持**：支持主流的 V2Ray (VMess)、Shadowsocks (SS) 以及 Trojan 协议。
- **友好界面**：现代化的 UI 设计，支持一键复制代码或直接下载 `.yaml` 配置文件。

## 部署教程

您可以轻松将此项目部署到自己的 GitHub Pages。

1. **Fork 本仓库**：
   - 点击页面右上角的 **Fork** 按钮，将项目克隆到您的 GitHub 账号下。

2. **启用 Pages**：
   - 进入您 Fork 后的仓库 **Settings** -> **Pages**。
   - 在 **Build and deployment** -> **Source** 中选择 **GitHub Actions**。

3. **触发部署**：
   - 切换到仓库的 **Actions** 标签页。
   - 在左侧列表中选择 **Deploy to GitHub Pages** 工作流。
   - 点击 **Run workflow** 按钮手动触发部署（之后每次推送到 `main` 分支都会自动部署）。

4. **自定义域名（可选）**：
   - 部署成功后，您可以回到 **Settings** -> **Pages** 配置您的自定义域名。

## 开发环境

本项目使用 [Vite](https://vite.dev/) + [React](https://react.dev/) + [Tailwind CSS](https://tailwindcss.com/) 开发。

### 运行

```bash
npm install
npm run dev
```

### 构建

```bash
npm run build
```

## 开源协议

本项目采用 [GPL-3.0](LICENSE) 开源协议。
