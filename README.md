
# 汽车资讯 App (前端 H5)

本项目是汽车资讯 App 的前端 Web/H5 工程，搭配 Go-Zero 后端服务运行。采用主流的响应式前端技术栈，致力于提供流畅的移动端浏览体验。

## 🛠 技术栈

- **核心框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **路由管理**: Vue Router 4
- **状态管理**: Pinia
- **UI 组件库**: Vant 4 (专为移动端打造)
- **网络请求**: Axios

## 📂 核心目录结构

```text
car-web/
├── public/         # 静态资源 (favicon等)
├── src/
│   ├── assets/     # 项目内联静态资源 (图片、基础CSS)
│   ├── components/ # 共享复用组件
│   ├── router/     # 路由配置中心
│   ├── store/      # Pinia 状态管理
│   ├── utils/      # 工具类 (如 axios 网络请求封装)
│   ├── views/      # 页面级组件 (首页、选车、我的等)
│   ├── App.vue     # 根组件
│   └── main.js     # 全局入口文件
├── vite.config.js  # Vite 构建及代理配置
└── package.json    # 依赖管理
```

## 🚀 快速运行指令

### 1. 安装依赖

**Bash**

```
npm install
```

### 2. 本地开发启动

启动前请确保后端 Go 服务已在 `localhost:8888` 运行中。Vite 已配置本地跨域代理。

**Bash**

```
npm run dev
```

### 3. 生产环境打包

**Bash**

```
npm run build
```
