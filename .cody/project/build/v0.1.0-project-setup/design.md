# Version Design Document : v0.1.0 - Project Setup
Technical implementation and design guide for the upcoming version.

## 1. Features Summary
_Overview of features included in this version._

本版本专注于建立项目的基础设施，为后续开发奠定坚实的技术基础。包含以下 6 个核心功能：

### V01-1: 项目初始化
- 使用 Vite 创建 React 18+ with TypeScript 项目
- 配置项目基础结构和文件组织
- 设置开发服务器和构建流程

### V01-2: UI 框架集成
- 集成 Tailwind CSS（原子化 CSS）
- 集成 Shadcn/ui（基于 Radix UI 的无头组件库）
- 配置主题系统基础

### V01-3: 代码规范配置
- 配置 ESLint（代码质量检查）
- 配置 Prettier（代码格式化）
- 设置 Git hooks（使用 husky 和 lint-staged）
- 配置 TypeScript 严格模式

### V01-4: Vercel 部署配置
- 创建 Vercel 项目配置
- 设置自动部署 CI/CD
- 配置环境变量管理

### V01-5: 国际化初始化
- 集成 react-i18next
- 配置中英文语言文件
- 创建语言切换组件

### V01-6: 主题切换功能
- 集成 next-themes
- 实现深色/浅色模式切换
- 配置 Tailwind 的暗色模式支持

## 2. Technical Architecture Overview
_High-level technical structure that supports all features in this version._

### 技术栈
- **构建工具**: Vite 5+
- **前端框架**: React 18.3+ with TypeScript 5.3+
- **样式方案**: Tailwind CSS 3.4+ (苹果风格简洁设计)
- **UI 组件**: Shadcn/ui + Radix UI
- **国际化**: react-i18next 14.0+
- **主题系统**: next-themes 0.2+
- **包管理器**: pnpm (推荐) 或 npm

### 项目目录结构
```
radar-bench/
├── .cody/                  # Cody PBT 配置
├── .github/                # GitHub Actions (可选)
├── public/                 # 静态资源
│   └── locales/            # 国际化语言文件
│       ├── zh/
│       │   └── common.json
│       └── en/
│           └── common.json
├── src/
│   ├── components/         # React 组件
│   │   ├── ui/             # Shadcn UI 基础组件
│   │   └── layout/         # 布局组件
│   │       ├── AppLayout.tsx
│   │       ├── Header.tsx
│   │       └── ThemeSwitcher.tsx
│   ├── lib/                # 工具函数
│   │   └── utils.ts        # Shadcn utils (cn 函数等)
│   ├── i18n/               # 国际化配置
│   │   └── config.ts
│   ├── App.tsx             # 根组件
│   ├── main.tsx            # 入口文件
│   └── index.css           # 全局样式
├── .eslintrc.cjs           # ESLint 配置
├── .prettierrc             # Prettier 配置
├── tailwind.config.js      # Tailwind 配置
├── tsconfig.json           # TypeScript 配置
├── vite.config.ts          # Vite 配置
├── package.json
├── vercel.json             # Vercel 部署配置
└── README.md
```

### 部署架构
- **开发环境**: `pnpm dev` → http://localhost:5173
- **构建产物**: Vite build → dist/
- **部署平台**: Vercel (自动部署主分支和 PR)

## 3. Implementation Notes
_Shared technical considerations across all features in this version._

### Tailwind CSS 配置要点
- 启用暗色模式：`darkMode: 'class'`
- 自定义颜色：考虑 TP-Link 品牌色或中性蓝色系
- 字体：使用系统字体栈（苹果风格）
  ```js
  fontFamily: {
    sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
  }
  ```

### Shadcn/ui 安装
使用 Shadcn CLI 按需安装组件：
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dropdown-menu
# 等等...
```

### TypeScript 配置
- 启用严格模式：`"strict": true`
- 路径别名：`@/*` → `./src/*`
- 包含声明文件：Vite、React、Node 类型

### ESLint + Prettier 配置
- ESLint: 使用 `@typescript-eslint` 和 React 插件
- Prettier: 集成到 ESLint 中，避免冲突
- Git hooks: 使用 `husky` + `lint-staged` 在 commit 前自动检查和格式化

### 国际化最佳实践
- 语言文件结构：`public/locales/{lang}/common.json`
- 默认语言：检测浏览器语言，回退到中文
- 命名空间：使用 `common` 作为主命名空间
- 翻译 key 命名：使用点分隔，如 `header.title`

### 主题系统
- 使用 `next-themes` 的 `ThemeProvider` 包裹应用
- 主题值：`light` | `dark` | `system`
- Tailwind 类名：使用 `dark:` 前缀定义暗色样式
- 持久化：自动存储到 localStorage

### Vercel 配置
- 框架检测：自动识别为 Vite 项目
- 构建命令：`pnpm build`
- 输出目录：`dist`
- Node 版本：18.x
- 区域：香港 (hkg1) - 最接近中国大陆

## 4. Other Technical Considerations
_Shared any other technical information that might be relevant to building this version._

### 性能优化
- Vite 的快速 HMR（热模块替换）
- 按需加载 Shadcn 组件（不打包未使用的组件）
- Tailwind 的 PurgeCSS（移除未使用的样式）

### 代码质量
- TypeScript 严格模式可能需要时间适应，但能提前发现错误
- ESLint 和 Prettier 可能在初期有冲突，需要仔细配置规则

### Git 工作流
- 主分支：`master` (当前)
- 提交规范：建议使用 Conventional Commits (如 `feat:`, `fix:`)
- Git hooks: pre-commit 运行 lint-staged

### 环境变量
本版本暂不需要敏感环境变量，后续版本（分享功能）会用到：
- `.env.local`: 本地开发环境变量（不提交到 Git）
- Vercel Dashboard: 生产环境变量配置

### 浏览器兼容性
目标浏览器：
- Chrome 90+
- Safari 14+
- Edge 90+
- Firefox 88+

不支持 IE 11。

### 响应式设计
本版本仅搭建基础布局，响应式设计在 v0.7.0 优化：
- 桌面优先设计
- 断点：Tailwind 默认断点（sm: 640px, md: 768px, lg: 1024px, xl: 1280px）

## 5. Open Questions
_Unresolved technical or product questions affecting this version._

### Q1: 是否使用 React Router？
- **问题**: 本版本是否需要集成路由？还是在后续版本（分享功能）再加？
- **建议**: 可以先不加，等到 v0.6.0 需要分享页面时再集成，保持当前版本简单
- **决策待定**: 接受建议

### Q2: 是否需要状态管理？
- **问题**: 本版本是否集成 Zustand？
- **建议**: 可以在 v0.2.0（Core Data Layer）再集成，本版本仅需要主题和语言状态（由库自带）
- **决策待定**: 接受建议

### Q3: Git hooks 的严格程度
- **问题**: pre-commit hook 是否要阻止不符合规范的提交？
- **建议**: 初期可以仅警告，不阻止；稳定后再严格执行
- **决策待定**: 接受建议

### Q4: Vercel 项目创建方式
- **问题**: 通过 Vercel CLI 还是 Dashboard 创建项目？
- **建议**: CLI 更快，但 Dashboard 更直观。建议先用 CLI，后续可在 Dashboard 调整
- **决策待定**: 接受建议

### Q5: 是否需要添加 README 文档？
- **问题**: 本版本是否编写详细的 README？
- **建议**: 可以先写基础的运行说明，详细文档留到 v1.0.0
- **决策待定**: 接受建议
