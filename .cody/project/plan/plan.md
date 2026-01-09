# Product Implementation Plan
这份文档定义了产品将如何构建以及实施时间线。

## Section Explanations
| Section                  | Overview |
|--------------------------|--------------------------|
| Overview                 | 简要回顾我们正在构建什么以及 PRD 的当前状态 |
| Architecture             | 高层次技术决策和结构（如前后端分离、框架、存储） |
| Components               | 系统的主要部分及其角色 |
| Data Model               | 需要哪些数据结构或模型 |
| Major Technical Steps    | 指导开发的高层次实施任务 |
| Tools & Services         | 应用依赖的外部工具、API、库或平台 |
| Risks & Unknowns         | 需要关注的技术或项目风险、开放性问题或障碍 |
| Milestones               | 显示进度的关键实施检查点或阶段 |
| Environment Setup        | 在本地/开发环境中运行应用的前置条件或步骤 |

## Overview

**Radar Bench** 是一个竞品能力对比可视化工具，旨在替代传统 Excel 方式，为 Omada 团队提供直观、易用、可协作的竞品分析平台。

本实施计划基于已完成的 PRD（产品需求文档），定义了技术架构、开发组件、数据模型和实施路线图。

### 产品状态
- ✅ Discovery 已完成
- ✅ PRD 已完成
- 🚧 Plan 文档编写中
- ⏳ 开发待启动

## Architecture

### 整体架构
采用 **前端为主 + 轻量级后端** 的架构模式：

```
┌─────────────────────────────────────────────────┐
│                  用户浏览器                        │
│  ┌──────────────────────────────────────────┐   │
│  │   React App (SPA)                       │   │
│  │   - 雷达图可视化                          │   │
│  │   - 数据管理                              │   │
│  │   - 本地存储 (LocalStorage/IndexedDB)    │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
                      ↕ (分享功能)
┌─────────────────────────────────────────────────┐
│              Vercel 平台                         │
│  ┌──────────────────────────────────────────┐   │
│  │   静态托管 (Vite Build Output)           │   │
│  │   - HTML/CSS/JS                          │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │   Serverless Functions (可选)            │   │
│  │   - 生成分享链接                          │   │
│  │   - 获取分享数据                          │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │   Vercel KV (Redis) 或 Blob              │   │
│  │   - 存储分享数据                          │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### 技术栈

#### 前端核心
- **框架**：React 18+ with TypeScript
- **构建工具**：Vite 5+
- **状态管理**：Zustand（轻量级、易用）
- **路由**：React Router v6（如需多页面）

#### UI 层
- **组件库**：Shadcn/ui + Radix UI（无头组件，高度可定制）
- **样式方案**：Tailwind CSS（原子化 CSS，符合苹果简洁风格）
- **图表库**：Apache ECharts（强大的雷达图支持）
- **图标**：Lucide React（简洁现代）

#### 交互功能
- **拖拽排序**：@dnd-kit/core + @dnd-kit/sortable
- **国际化**：react-i18next
- **主题切换**：next-themes（支持深色/浅色模式）
- **表格组件**：@tanstack/react-table（可选，如需高级表格功能）

#### 数据处理
- **本地存储**：Dexie.js（IndexedDB 封装，支持复杂数据结构）
- **Excel 导入导出**：SheetJS (xlsx)
- **数据校验**：Zod（TypeScript 优先的 schema 验证）

#### 后端服务（轻量级）
- **托管平台**：Vercel
- **Serverless**：Vercel Functions（Node.js/Edge Runtime）
- **数据存储**：Vercel KV（Redis）或 Vercel Blob（文件存储）
- **分享方案备选**：
  - 方案 A：数据压缩后编码到 URL（无需后端）
  - 方案 B：Vercel KV 存储 JSON，返回短链接（推荐）

### 部署架构
- **开发环境**：本地 Vite Dev Server
- **预览环境**：Vercel Preview Deployment（每个 PR 自动部署）
- **生产环境**：Vercel Production（主分支自动部署）

## Components

### 1. 布局组件 (Layout)
- **AppLayout**：全局布局容器
- **Header**：顶部导航栏（语言切换、主题切换、导入导出）
- **Footer**：页脚信息（可选）

### 2. 雷达图展示区 (Radar Chart Area)
- **RadarTabBar**：雷达图 Tab 导航，支持切换、拖拽排序、新增/删除
- **MainRadarChart**：主雷达图组件（ECharts 封装）
  - 显示一级维度
  - 多系列叠加
  - 点击维度触发子维度展开
- **SubRadarChart**：子维度雷达图（级联展开）
  - 侧边滑入动画
  - 展示选中维度的子维度对比
- **ChartToolbar**：图表工具栏
  - 系列显隐控制
  - 全屏查看
  - 导出图片（PNG/SVG）

### 3. 数据设置区 (Settings Area)
- **RadarSettings**：雷达图管理面板
  - 新增/删除/复制/重命名雷达图
- **VendorManager**：竞品系列管理
  - 新增/删除系列
  - 设置名称、颜色、标记类型
  - 拖拽排序
- **DimensionManager**：维度管理（表格形式）
  - 一级维度列表
  - 新增/删除维度
  - 设置名称、说明、权重、分数
  - 拖拽排序
  - 展开/收起子维度
- **SubDimensionEditor**：子维度编辑器
  - 子维度增删改
  - 权重和分数输入
  - 自动计算父维度分数
- **ScoreBoard**：总分展示
  - 计算并显示每个竞品的总分
  - 排名展示

### 4. 数据导入导出 (Import/Export)
- **ImportDialog**：导入对话框
  - 支持 Excel、JSON 格式
  - 文件上传、格式校验
  - 预览数据、确认导入
- **ExportMenu**：导出菜单
  - 选择导出格式（Excel、JSON、PNG、SVG）
  - 下载文件
- **TemplateDownload**：模板下载功能

### 5. 分享与协作 (Share & Collaboration)
- **ShareDialog**：分享对话框
  - 选择"仅查看"或"可编辑"模式
  - 生成分享链接
  - 复制链接到剪贴板
- **ShareView**：分享页面（独立路由）
  - 展示只读或可编辑的雷达图
  - 根据权限显示/隐藏编辑功能

### 6. 工具组件 (Utilities)
- **LanguageSwitcher**：语言切换器（中/英）
- **ThemeSwitcher**：主题切换器（深色/浅色）
- **Tooltip**：自定义提示组件（显示维度说明）
- **ConfirmDialog**：确认对话框（删除操作等）
- **LoadingSpinner**：加载动画

### 7. 存储与状态管理 (Store & State)
- **useRadarStore**：Zustand Store
  - 管理雷达图列表
  - 管理当前激活的雷达图
  - 管理竞品系列
  - 管理维度和子维度
  - 管理评分数据
- **LocalStorageService**：本地存储服务
  - 自动保存数据到 IndexedDB
  - 加载本地数据
  - 数据备份和恢复
- **ShareService**：分享服务
  - 调用 API 生成分享链接
  - 获取分享数据

## Data Model

### 核心数据结构

```typescript
// 雷达图
interface RadarChart {
  id: string;                  // 唯一标识
  name: string;                // 雷达图名称
  createdAt: Date;             // 创建时间
  updatedAt: Date;             // 更新时间
  vendors: Vendor[];           // 竞品系列列表
  dimensions: Dimension[];     // 一级维度列表
}

// 竞品系列（Vendor）
interface Vendor {
  id: string;                  // 唯一标识
  name: string;                // 系列名称（如 "Omada"）
  color: string;               // 颜色（HEX）
  symbol: 'circle' | 'rect' | 'triangle' | 'diamond';  // 标记类型
  order: number;               // 排序序号
}

// 一级维度
interface Dimension {
  id: string;                  // 唯一标识
  name: string;                // 维度名称
  description?: string;        // 维度说明（评分标准）
  weight: number;              // 权重（0-100，总和 100%）
  order: number;               // 排序序号
  scores: Record<string, number>;  // 每个 Vendor 的分数 { vendorId: score }
  subDimensions?: SubDimension[];  // 子维度（可选）
}

// 子维度
interface SubDimension {
  id: string;                  // 唯一标识
  name: string;                // 子维度名称
  description?: string;        // 子维度说明
  weight: number;              // 在父维度内的权重（0-100，总和 100%）
  order: number;               // 排序序号
  scores: Record<string, number>;  // 每个 Vendor 的分数 { vendorId: score }
}

// 应用状态
interface AppState {
  radarCharts: RadarChart[];   // 所有雷达图
  activeChartId: string | null; // 当前激活的雷达图 ID
  language: 'zh' | 'en';       // 语言设置
  theme: 'light' | 'dark';     // 主题设置
}

// 分享数据
interface ShareData {
  id: string;                  // 分享 ID（短链接）
  chartData: RadarChart;       // 雷达图数据
  permission: 'view' | 'edit'; // 权限类型
  createdAt: Date;             // 创建时间
  expiresAt?: Date;            // 过期时间（可选）
}

// Excel 导入/导出格式
interface ExcelData {
  chartName: string;
  vendors: { name: string; color: string }[];
  dimensions: {
    name: string;
    description?: string;
    weight: number;
    scores: Record<string, number>;
    subDimensions?: {
      name: string;
      description?: string;
      weight: number;
      scores: Record<string, number>;
    }[];
  }[];
}
```

### 数据验证规则

```typescript
// 使用 Zod 定义 Schema
const DimensionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, '维度名称不能为空'),
  description: z.string().optional(),
  weight: z.number().min(0).max(100),
  order: z.number(),
  scores: z.record(z.string(), z.number().min(0).max(10).int()),
  subDimensions: z.array(SubDimensionSchema).optional(),
});

// 权重验证：所有维度权重总和必须为 100
const validateWeights = (dimensions: Dimension[]) => {
  const total = dimensions.reduce((sum, dim) => sum + dim.weight, 0);
  return total === 100;
};

// 子维度权重验证
const validateSubWeights = (subDimensions: SubDimension[]) => {
  const total = subDimensions.reduce((sum, sub) => sum + sub.weight, 0);
  return total === 100;
};
```

## Major Technical Steps

### Phase 1: 项目初始化与基础设置
1. 使用 Vite 创建 React + TypeScript 项目
2. 配置 Tailwind CSS 和 Shadcn/ui
3. 设置项目目录结构和代码规范（ESLint、Prettier）
4. 配置 Git 和 Vercel 部署
5. 初始化 i18n 国际化（中英文）
6. 实现主题切换功能（深色/浅色）

### Phase 2: 核心数据层
1. 设计和实现数据模型（TypeScript 接口）
2. 使用 Zod 定义数据验证 Schema
3. 创建 Zustand Store（状态管理）
4. 实现 IndexedDB 本地存储服务（Dexie.js）
5. 实现自动保存和数据恢复逻辑

### Phase 3: 雷达图可视化
1. 集成 ECharts 库
2. 实现主雷达图组件
   - 多系列数据渲染
   - 交互功能（悬浮、点击）
   - 动画效果
3. 实现子维度雷达图组件
   - 级联展开动画
   - 数据筛选和渲染
4. 实现图表工具栏
   - 系列显隐切换
   - 全屏查看
   - 导出图片功能（PNG/SVG）

### Phase 4: 数据管理界面
1. 实现雷达图 Tab 导航
   - Tab 切换
   - 拖拽排序（dnd-kit）
   - 新增/删除/重命名
2. 实现竞品系列管理
   - 系列增删改
   - 颜色选择器
   - 拖拽排序
3. 实现维度管理表格
   - 维度增删改
   - 权重输入和验证（总和 100%）
   - 分数输入（0-10 整数）
   - 拖拽排序
4. 实现子维度编辑器
   - 展开/收起动画
   - 子维度增删改
   - 权重和分数输入
   - 自动计算父维度分数
5. 实现总分计算和排名展示

### Phase 5: 数据导入导出
1. 设计 Excel 模板格式
2. 实现 Excel 导入功能
   - 文件上传
   - 数据解析（SheetJS）
   - 格式校验和错误提示
   - 数据预览和确认
3. 实现 Excel 导出功能
4. 实现 JSON 导入导出
5. 实现模板下载功能
6. 实现图表导出为图片（PNG/SVG）

### Phase 6: 分享与协作功能
1. 设计分享链接方案（选择 Vercel KV 或 URL 编码）
2. 实现 Vercel Serverless Functions
   - POST /api/share：创建分享链接
   - GET /api/share/:id：获取分享数据
3. 实现前端分享对话框
   - 选择权限（仅查看/可编辑）
   - 生成链接
   - 复制到剪贴板
4. 实现分享页面路由和视图
   - 只读模式：隐藏编辑功能
   - 可编辑模式：允许修改数据
5. 实现协作数据同步（保存到后端）

### Phase 7: UI/UX 优化
1. 实现响应式布局（桌面优先，移动适配）
2. 添加加载状态和骨架屏
3. 添加错误处理和用户提示
4. 优化动画效果和过渡
5. 添加键盘快捷键支持（可选）
6. 进行无障碍优化（ARIA 标签、键盘导航）

### Phase 8: 测试与部署
1. 编写单元测试（关键业务逻辑）
2. 编写集成测试（关键用户流程）
3. 浏览器兼容性测试
4. 性能优化（代码分割、懒加载）
5. 部署到 Vercel 生产环境
6. 配置自定义域名（可选）

## Tools & Services

### 开发工具
- **IDE**：VS Code（推荐）
- **包管理器**：pnpm 或 npm
- **版本控制**：Git + GitHub

### 核心依赖
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.0",
    "zustand": "^4.5.0",
    "echarts": "^5.5.0",
    "echarts-for-react": "^3.0.2",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "react-i18next": "^14.0.0",
    "i18next": "^23.8.0",
    "dexie": "^3.2.5",
    "dexie-react-hooks": "^1.1.7",
    "xlsx": "^0.18.5",
    "zod": "^3.22.4",
    "next-themes": "^0.2.1",
    "lucide-react": "^0.344.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.56",
    "@types/react-dom": "^18.2.19",
    "typescript": "^5.3.3",
    "vite": "^5.1.0",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "eslint": "^8.56.0",
    "prettier": "^3.2.5"
  }
}
```

### UI 组件（Shadcn/ui）
需要安装的 Shadcn 组件：
- Button
- Dialog
- Tabs
- Table
- Select
- Input
- Tooltip
- DropdownMenu
- Popover
- Switch
- Slider
- Card

### 平台服务
- **Vercel**：托管、部署、Serverless Functions
- **Vercel KV**：分享数据存储（Redis）
- **Vercel Analytics**：网站分析（可选）

### 辅助工具
- **Figma**：设计稿参考（如有）
- **Excalidraw**：架构图绘制
- **Lighthouse**：性能和可访问性审计

## Risks & Unknowns

### 技术风险

1. **ECharts 雷达图定制复杂度**
   - 风险：子维度级联展开可能需要深度定制 ECharts 配置
   - 缓解：提前验证 ECharts API，必要时使用 Canvas 自绘

2. **URL 编码分享方案的数据大小限制**
   - 风险：数据过大时 URL 可能超过浏览器限制（~2000 字符）
   - 缓解：优先使用 Vercel KV 方案，URL 编码作为备选

3. **IndexedDB 浏览器兼容性**
   - 风险：部分旧版浏览器可能不支持 IndexedDB
   - 缓解：降级到 LocalStorage，牺牲部分功能

4. **Excel 导入的数据格式多样性**
   - 风险：用户可能提供不符合模板的 Excel 文件
   - 缓解：严格的数据校验和友好的错误提示

5. **权重总和 100% 的用户体验**
   - 风险：手动调整权重时难以保证总和为 100%
   - 缓解：实现自动分配和智能调整功能

### 产品风险

1. **用户采用率**
   - 风险：团队可能不习惯新工具，继续使用 Excel
   - 缓解：提供平滑的 Excel 导入功能，降低迁移成本

2. **分享链接的安全性**
   - 风险：无密码保护的链接可能被泄露
   - 缓解：v1.0 先不考虑，后续版本可加密码或过期时间

3. **移动端体验**
   - 风险：移动端仅查看，编辑需求可能后续增加
   - 缓解：架构设计时预留移动端编辑的可能性

### 未知因素

1. **Vercel KV 免费额度**
   - 需要确认：Vercel KV 免费版是否满足需求
   - 行动：查阅 Vercel 定价文档，评估成本

2. **雷达图性能**
   - 需要验证：多系列、多维度时 ECharts 渲染性能
   - 行动：尽早构建 Demo 进行性能测试

3. **国际化最佳实践**
   - 需要研究：react-i18next 的最佳配置和使用方式
   - 行动：参考官方文档和社区最佳实践

## Milestones

### M1: 项目基础设施搭建
- 完成项目初始化和配置
- 实现基础布局和导航
- 集成 i18n 和主题切换
- **交付物**：可部署的空白应用骨架

### M2: 核心数据层和状态管理
- 完成数据模型设计
- 实现 Zustand Store
- 实现本地存储服务
- **交付物**：可持久化的数据管理系统

### M3: 雷达图可视化（MVP）
- 实现主雷达图（无子维度）
- 实现基础交互（悬浮、图例）
- 实现简单的数据编辑界面
- **交付物**：可展示和编辑雷达图的最小可用版本

### M4: 完整数据管理功能
- 实现 Tab 导航和多雷达图管理
- 实现竞品系列管理
- 实现维度和子维度管理
- 实现子维度雷达图级联展开
- 实现拖拽排序
- **交付物**：完整的数据编辑和可视化功能

### M5: 导入导出功能
- 实现 Excel 导入导出
- 实现 JSON 导入导出
- 实现图片导出
- 实现模板下载
- **交付物**：完整的数据迁移能力

### M6: 分享与协作
- 实现分享链接生成
- 实现分享页面（只读/可编辑）
- 部署 Vercel Functions 和 KV
- **交付物**：可分享和协作的完整应用

### M7: UI/UX 优化和测试
- 响应式优化
- 动画和交互优化
- 浏览器兼容性测试
- 用户验收测试
- **交付物**：生产就绪的 v1.0 版本

### M8: 正式发布
- 部署到生产环境
- 编写用户文档
- 团队培训和推广
- **交付物**：正式上线的产品

## Environment Setup

### 前置要求
- **Node.js**：v18.0.0 或更高版本
- **包管理器**：pnpm（推荐）或 npm
- **Git**：最新版本
- **浏览器**：Chrome/Safari/Edge（最新版本）
- **IDE**：VS Code（推荐）

### 开发环境设置步骤

#### 1. 克隆仓库并安装依赖
```bash
# 克隆项目
git clone <repository-url>
cd radar-bench

# 安装依赖
pnpm install
# 或
npm install
```

#### 2. 配置环境变量
创建 `.env.local` 文件：
```bash
# Vercel KV（分享功能）
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token

# 应用配置（可选）
VITE_APP_TITLE=Radar Bench
VITE_APP_BASE_URL=http://localhost:5173
```

#### 3. 启动开发服务器
```bash
pnpm dev
# 或
npm run dev
```

访问 `http://localhost:5173`

#### 4. 构建生产版本
```bash
pnpm build
# 或
npm run build
```

#### 5. 预览生产构建
```bash
pnpm preview
# 或
npm run preview
```

### VS Code 推荐扩展
- **ESLint**：代码质量检查
- **Prettier**：代码格式化
- **Tailwind CSS IntelliSense**：Tailwind 类名提示
- **TypeScript Vue Plugin**：TypeScript 支持
- **i18n Ally**：国际化支持

### 项目目录结构
```
radar-bench/
├── .cody/                  # Cody PBT 配置
├── public/                 # 静态资源
├── src/
│   ├── api/                # API 调用（分享功能）
│   ├── components/         # React 组件
│   │   ├── charts/         # 雷达图组件
│   │   ├── settings/       # 数据设置组件
│   │   ├── layout/         # 布局组件
│   │   └── ui/             # Shadcn UI 组件
│   ├── hooks/              # 自定义 Hooks
│   ├── lib/                # 工具函数
│   ├── locales/            # 国际化文案
│   ├── services/           # 业务服务（存储、导入导出）
│   ├── store/              # Zustand Store
│   ├── types/              # TypeScript 类型定义
│   ├── App.tsx             # 根组件
│   └── main.tsx            # 入口文件
├── api/                    # Vercel Serverless Functions
│   └── share/
│       ├── create.ts       # 创建分享
│       └── [id].ts         # 获取分享数据
├── .env.local              # 本地环境变量
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

### 常用命令
```bash
# 开发
pnpm dev

# 类型检查
pnpm type-check

# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 构建
pnpm build

# 预览
pnpm preview

# 部署到 Vercel（需先安装 Vercel CLI）
vercel deploy
```

### Vercel 部署配置

#### vercel.json
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "vite",
  "regions": ["hkg1"]
}
```

### 首次部署到 Vercel
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 初始化项目
vercel

# 配置 Vercel KV
vercel env add KV_REST_API_URL
vercel env add KV_REST_API_TOKEN

# 部署
vercel --prod
```
