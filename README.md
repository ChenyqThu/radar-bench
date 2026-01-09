# Radar Bench

🎯 竞品能力对比可视化工具 | Competitive Analysis Visualization Tool

一个现代化的竞品分析工具，帮助团队直观地比较和展示产品与竞品之间的能力差异。

## ✨ 功能特性

### 核心功能
- 📊 **多雷达图管理**：支持创建、重命名、复制、删除多个雷达图，灵活管理不同对比场景
- 🎯 **双雷达图联动**：主雷达图和子维度雷达图并排显示，点击维度查看详细子维度对比
- 📈 **维度层级管理**：支持一级维度和子维度的完整层级结构，权重自动验证
- 🏆 **竞品管理**：自定义竞品颜色、标记类型，拖拽排序
- ⚖️ **智能计算**：子维度分数自动加权计算父维度分数，实时排名展示
- 🎨 **可视化对比**：基于 ECharts 的交互式雷达图，直观展示多维度能力差异

### 交互体验
- 🖱️ **拖拽排序**：支持雷达图 Tab、竞品、维度、子维度的拖拽排序
- ✏️ **内联编辑**：双击或点击即可编辑名称、权重、分数
- 🔢 **分数输入**：智能分数输入，自动验证范围 (0-10)
- ✅ **数据验证**：实时权重总和验证，确保数据准确性
- 🗑️ **删除确认**：重要数据删除前弹出确认对话框，防止误操作
- 🛡️ **错误处理**：完整的 Error Boundary 保护，优雅处理运行时错误

### 界面与主题
- 🎨 **现代化 UI**：基于 Shadcn/ui 的简洁优雅设计
- 🌓 **主题切换**：支持深色/浅色/跟随系统三种模式，完整的主题适配
- 🌍 **国际化**：完整的中英文双语支持
- 📱 **响应式设计**：优化桌面端布局，支持不同屏幕尺寸

### 技术特性
- ⚡ **性能优化**：React.memo 优化组件渲染，基于 Vite 的快速开发体验
- 💾 **本地存储**：基于 Zustand + IndexedDB 的状态管理和持久化
- ♿ **无障碍性**：ARIA 标签支持，提升可访问性
- 🎯 **类型安全**：完整的 TypeScript 类型定义

## 🚀 快速开始

### 前置要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0（推荐）或 npm

### 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install
```

### 开发环境

```bash
# 启动开发服务器
pnpm dev

# 应用将在 http://localhost:5173 启动
```

### 生产构建

```bash
# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

## 📦 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **样式**: Tailwind CSS 4 + Shadcn/ui
- **图表**: Apache ECharts + echarts-for-react
- **状态管理**: Zustand + Immer
- **数据持久化**: IndexedDB (Dexie.js)
- **拖拽**: @dnd-kit (core + sortable)
- **国际化**: react-i18next
- **主题**: next-themes
- **代码质量**: ESLint + TypeScript
- **部署**: Vercel

## 🛠️ 开发命令

```bash
# 启动开发服务器
pnpm dev

# 类型检查
pnpm type-check

# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 运行单元测试
pnpm test

# 运行单元测试（UI模式）
pnpm test:ui

# 运行E2E测试
pnpm test:e2e

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

## 📁 项目结构

```
radar-bench/
├── .cody/                  # Cody PBT 项目管理文件
│   └── project/build/      # 版本开发任务清单
├── public/                 # 静态资源
│   └── locales/            # 国际化语言文件
│       ├── zh/             # 中文
│       └── en/             # 英文
├── src/
│   ├── components/         # React 组件
│   │   ├── ui/             # Shadcn UI 基础组件
│   │   ├── layout/         # 布局组件
│   │   ├── charts/         # 雷达图组件
│   │   ├── radar/          # 雷达图管理
│   │   ├── vendors/        # 竞品管理
│   │   ├── dimensions/     # 维度管理
│   │   ├── scoreboard/     # 排名面板
│   │   └── ErrorBoundary.tsx  # 错误边界
│   ├── store/              # Zustand 状态管理
│   ├── lib/                # 工具函数
│   │   ├── calculations.ts # 分数计算
│   │   ├── validators.ts   # 数据验证
│   │   └── constants.ts    # 常量定义
│   ├── hooks/              # 自定义 Hooks
│   ├── types/              # TypeScript 类型定义
│   ├── i18n/               # 国际化配置
│   ├── App.tsx             # 根组件
│   ├── main.tsx            # 入口文件
│   └── index.css           # 全局样式
├── package.json
├── tsconfig.json           # TypeScript 配置
├── tailwind.config.js      # Tailwind CSS 配置
├── vite.config.ts          # Vite 配置
└── vercel.json             # Vercel 部署配置
```

## 🌐 部署

项目已配置 Vercel 部署，推送到主分支会自动触发部署。

```bash
# 手动部署到 Vercel
vercel --prod
```

## 📝 环境变量

本项目目前不需要配置环境变量。

未来版本如需使用分享功能（Vercel KV），需要配置：

```env
# .env.local
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token
```

## 🗺️ 开发路线图

### v0.1.0 - 项目基础设施 ✅
- [x] 项目初始化
- [x] UI 框架集成（Shadcn/ui）
- [x] 国际化和主题系统
- [x] 基础布局

### v0.2.0 - 核心数据层 ✅
- [x] 数据模型设计（Dimension, SubDimension, Vendor, RadarChart）
- [x] 状态管理（Zustand + Immer）
- [x] 本地存储（IndexedDB + Dexie.js）
- [x] 数据持久化和恢复

### v0.3.0 - 雷达图可视化 MVP ✅
- [x] ECharts 集成
- [x] 主雷达图组件
- [x] 图表交互和主题适配
- [x] 自适应窗口大小

### v0.4.0 - 完整数据管理 ✅ (100% 完成)

#### Phase 1: 基础管理功能 ✅
- [x] 安装新依赖包（@dnd-kit, react-colorful）
- [x] 添加 Shadcn UI 组件（tabs, table, dialog, alert 等）
- [x] 创建工具函数（计算、验证）
- [x] 扩展数据模型（支持排序、子维度）
- [x] 实现雷达图 Tab 导航栏（创建、重命名、删除、复制）
- [x] 实现竞品管理器（列表、增删改、颜色选择、标记类型）
- [x] 实现维度管理表格（基础版本）
- [x] 实现总分计算和排名展示

#### Phase 2: 权重与自动计算 ✅
- [x] 创建权重验证函数和 Hook
- [x] 实现权重验证提示组件
- [x] 实现子维度数据结构和组件
- [x] 实现展开/收起逻辑
- [x] 实现自动计算函数（子维度加权计算父维度）
- [x] 集成自动计算到维度行

#### Phase 3: 高级交互 ✅
- [x] 实现 Tab 拖拽排序
- [x] 实现竞品拖拽排序
- [x] 实现一级维度拖拽排序
- [x] 实现子维度拖拽排序
- [x] 优化拖拽视觉反馈
- [x] 实现子维度雷达图组件（双图联动）
- [x] 添加键盘快捷键支持（Tab, Enter, Esc）
- [x] 添加加载状态和骨架屏

#### Phase 4: 优化与收尾 ✅ (13/13 完成)
- [x] 性能优化（React.memo, useMemo）
- [x] 实现 Error Boundary
- [x] 添加空状态 UI
- [x] 实现删除确认对话框
- [x] 添加 ARIA 标签
- [x] 添加国际化文案
- [x] 主题适配检查
- [x] 响应式布局优化
- [x] 单元测试（51个测试用例全部通过）
- [x] 集成测试（E2E测试，4个测试用例全部通过）
- [x] 浏览器兼容性测试（Chromium/Chrome测试通过）
- [x] 更新文档
- [x] 代码审查和清理

### v0.5.0 - 数据导入导出（计划中）
- [ ] 导出为 JSON
- [ ] 导出为 PNG/SVG 图片
- [ ] 导入 JSON 数据
- [ ] 数据模板功能

### v0.6.0 - 高级功能（计划中）
- [ ] 历史版本对比
- [ ] 数据分享（Vercel KV）
- [ ] 报告生成
- [ ] 批量操作

更多详情请查看 `.cody/project/build/`

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 开源协议

MIT License

## 👨‍💻 作者

使用 [Claude Code](https://claude.com/claude-code) 构建

---

⭐ 如果这个项目对你有帮助，请给它一个 Star！
