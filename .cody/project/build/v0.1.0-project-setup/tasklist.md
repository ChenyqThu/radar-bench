# Version Tasklist – v0.1.0 - Project Setup
This document outlines all the tasks to work on to deliver this particular version, grouped by phases.

| Status |      |
|--------|------|
| 🔴 | Not Started |
| 🟡 | In Progress |
| 🟢 | Completed |

---

## Phase 1: 项目初始化和基础配置

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| P1-1 | 创建 Vite + React + TypeScript 项目 | 使用 `pnpm create vite` 初始化项目，选择 React + TypeScript 模板 | None | 🔴 Not Started | AGENT |
| P1-2 | 配置 TypeScript 严格模式 | 修改 tsconfig.json，启用 strict mode 和路径别名 @/* | P1-1 | 🔴 Not Started | AGENT |
| P1-3 | 创建基础项目目录结构 | 创建 src/components, src/lib, src/i18n 等文件夹 | P1-1 | 🔴 Not Started | AGENT |
| P1-4 | 安装基础依赖 | 安装项目所需的核心依赖包 | P1-1 | 🔴 Not Started | AGENT |
| P1-5 | 测试开发服务器 | 运行 `pnpm dev` 确保项目正常启动 | P1-4 | 🔴 Not Started | AGENT |

---

## Phase 2: Tailwind CSS 和 Shadcn/ui 集成

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| P2-1 | 安装 Tailwind CSS | 安装 tailwindcss, autoprefixer, postcss | P1-4 | 🔴 Not Started | AGENT |
| P2-2 | 配置 Tailwind | 创建 tailwind.config.js，配置 content paths 和 darkMode | P2-1 | 🔴 Not Started | AGENT |
| P2-3 | 配置全局 CSS | 在 src/index.css 添加 Tailwind directives | P2-2 | 🔴 Not Started | AGENT |
| P2-4 | 初始化 Shadcn/ui | 运行 `npx shadcn-ui@latest init`，配置组件路径 | P2-3 | 🔴 Not Started | AGENT |
| P2-5 | 安装基础 UI 组件 | 安装 Button, DropdownMenu, Switch 等基础组件 | P2-4 | 🔴 Not Started | AGENT |
| P2-6 | 自定义 Tailwind 主题 | 配置颜色、字体（系统字体栈，苹果风格） | P2-2 | 🔴 Not Started | AGENT |
| P2-7 | 测试 Tailwind 样式 | 创建测试组件验证 Tailwind 和 Shadcn 工作正常 | P2-5 | 🔴 Not Started | AGENT |

---

## Phase 3: 代码质量工具配置

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| P3-1 | 安装 ESLint | 安装 eslint, @typescript-eslint/parser, @typescript-eslint/eslint-plugin | P1-4 | 🔴 Not Started | AGENT |
| P3-2 | 配置 ESLint | 创建 .eslintrc.cjs，配置 React 和 TypeScript 规则 | P3-1 | 🔴 Not Started | AGENT |
| P3-3 | 安装 Prettier | 安装 prettier, eslint-config-prettier, eslint-plugin-prettier | P1-4 | 🔴 Not Started | AGENT |
| P3-4 | 配置 Prettier | 创建 .prettierrc，配置格式化规则 | P3-3 | 🔴 Not Started | AGENT |
| P3-5 | 集成 ESLint 和 Prettier | 配置 ESLint 使用 Prettier，避免规则冲突 | P3-2, P3-4 | 🔴 Not Started | AGENT |
| P3-6 | 安装 Husky 和 lint-staged | 安装 Git hooks 工具 | P1-4 | 🔴 Not Started | AGENT |
| P3-7 | 配置 Git hooks | 设置 pre-commit hook 运行 lint-staged | P3-6 | 🔴 Not Started | AGENT |
| P3-8 | 配置 lint-staged | 设置对暂存文件运行 ESLint 和 Prettier | P3-7 | 🔴 Not Started | AGENT |
| P3-9 | 添加 npm scripts | 添加 lint, format, type-check 等脚本到 package.json | P3-5 | 🔴 Not Started | AGENT |
| P3-10 | 测试代码质量工具 | 运行 lint 和 format 命令，测试 Git hooks | P3-9 | 🔴 Not Started | AGENT |

---

## Phase 4: 国际化和主题系统

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| P4-1 | 安装 react-i18next | 安装 react-i18next 和 i18next | P1-4 | 🔴 Not Started | AGENT |
| P4-2 | 创建语言文件结构 | 创建 public/locales/zh/common.json 和 en/common.json | P1-3 | 🔴 Not Started | AGENT |
| P4-3 | 配置 i18n | 创建 src/i18n/config.ts，配置语言检测和回退 | P4-1, P4-2 | 🔴 Not Started | AGENT |
| P4-4 | 在 App 中初始化 i18n | 在 main.tsx 导入并初始化 i18n 配置 | P4-3 | 🔴 Not Started | AGENT |
| P4-5 | 创建语言切换组件 | 创建 LanguageSwitcher 组件 | P4-4, P2-5 | 🔴 Not Started | AGENT |
| P4-6 | 添加初始翻译内容 | 在语言文件中添加测试用的中英文文案 | P4-2 | 🔴 Not Started | AGENT |
| P4-7 | 安装 next-themes | 安装 next-themes 包 | P1-4 | 🔴 Not Started | AGENT |
| P4-8 | 配置主题 Provider | 在 App.tsx 添加 ThemeProvider | P4-7 | 🔴 Not Started | AGENT |
| P4-9 | 配置 Tailwind 暗色模式 | 在 tailwind.config.js 设置 darkMode: 'class' | P2-2 | 🔴 Not Started | AGENT |
| P4-10 | 创建主题切换组件 | 创建 ThemeSwitcher 组件（切换 light/dark/system） | P4-8, P2-5 | 🔴 Not Started | AGENT |
| P4-11 | 测试国际化 | 验证语言切换功能正常工作 | P4-5, P4-6 | 🔴 Not Started | AGENT |
| P4-12 | 测试主题切换 | 验证深色/浅色模式切换正常工作 | P4-10 | 🔴 Not Started | AGENT |

---

## Phase 5: 基础布局和 Header

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| P5-1 | 创建 AppLayout 组件 | 创建全局布局容器组件 | P2-5 | 🔴 Not Started | AGENT |
| P5-2 | 创建 Header 组件 | 创建顶部导航栏组件 | P2-5 | 🔴 Not Started | AGENT |
| P5-3 | 集成语言和主题切换到 Header | 在 Header 中添加 LanguageSwitcher 和 ThemeSwitcher | P5-2, P4-5, P4-10 | 🔴 Not Started | AGENT |
| P5-4 | 添加应用标题和 Logo | 在 Header 中显示 "Radar Bench" 标题 | P5-2 | 🔴 Not Started | AGENT |
| P5-5 | 优化布局样式 | 使用 Tailwind 实现简洁优雅的苹果风格布局 | P5-1, P5-3 | 🔴 Not Started | AGENT |
| P5-6 | 测试响应式布局 | 验证在不同屏幕尺寸下布局正常 | P5-5 | 🔴 Not Started | AGENT |

---

## Phase 6: Vercel 部署配置

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| P6-1 | 创建 vercel.json | 配置 Vercel 部署参数（构建命令、输出目录等） | P1-1 | 🔴 Not Started | AGENT |
| P6-2 | 创建 .gitignore | 配置忽略 node_modules, dist, .env.local 等 | P1-1 | 🔴 Not Started | AGENT |
| P6-3 | 初始化 Git 仓库 | 运行 git init，创建初始提交 | P6-2 | 🔴 Not Started | USER |
| P6-4 | 测试生产构建 | 运行 `pnpm build` 和 `pnpm preview` | Phase 1-5 全部完成 | 🔴 Not Started | AGENT |
| P6-5 | 安装 Vercel CLI | 全局安装 vercel CLI 工具 | None | 🔴 Done | USER |
| P6-6 | 登录 Vercel | 运行 `vercel login` | P6-5 | 🔴 Done | USER |
| P6-7 | 初始化 Vercel 项目 | 运行 `vercel`，创建项目并关联 | P6-6 | 🔴 Done | USER |
| P6-8 | 部署到 Vercel | 运行 `vercel --prod` 部署到生产环境 | P6-7 | 🔴 Not Started | USER |
| P6-9 | 验证线上部署 | 访问 Vercel URL，验证应用正常运行 | P6-8 | 🔴 Not Started | USER |

---

## Phase 7: 文档和收尾

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| P7-1 | 创建基础 README | 编写项目说明、安装步骤、运行命令 | P1-1 | 🔴 Not Started | AGENT |
| P7-2 | 添加环境变量说明 | 在 README 中说明 .env.local 的使用（为后续版本准备） | P7-1 | 🔴 Not Started | AGENT |
| P7-3 | 清理测试代码 | 移除开发过程中的测试组件和调试代码 | Phase 1-6 全部完成 | 🔴 Not Started | AGENT |
| P7-4 | 最终测试 | 完整测试所有功能（语言切换、主题切换、部署） | P7-3 | 🔴 Not Started | USER |
| P7-5 | Git 提交所有更改 | 创建完整的 Git 提交历史 | P7-4 | 🔴 Not Started | USER |

---

## 总结

**总任务数**: 47 个任务
**阶段数**: 7 个阶段
**预计时间**: 根据实际开发速度调整

**关键依赖链**:
1. Phase 1 → Phase 2 → Phase 3, 4, 5 → Phase 6 → Phase 7
2. Phase 4 的国际化和主题可以与 Phase 3 并行
3. Phase 5 依赖 Phase 4 的部分输出
4. Phase 6 需要前面所有阶段完成
