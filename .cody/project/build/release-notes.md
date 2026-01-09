# Release Notes

本文档记录了在每个版本构建期间实现的新功能、错误修复和其他更改。

---

## 目录

- [v0.3.0 - Radar Visualization MVP](#v030---radar-visualization-mvp---2026-01-09)
- [v0.2.0 - Core Data Layer](#v020---core-data-layer---2026-01-08)
- [v0.1.0 - Project Setup](#v010---project-setup---2026-01-07)

---

# v0.3.0 - Radar Visualization MVP - 2026-01-09

## 概述
雷达图可视化最小可用版本，实现了基础的图表展示和数据编辑功能。这是产品从数据层向可视化层的关键升级，用户现在可以看到和编辑雷达图数据。

## 主要功能

### 雷达图可视化
- ✅ **ECharts 集成**：成功集成 Apache ECharts 5.5.0 图表库
- ✅ **多系列雷达图渲染**：支持多个竞品（Vendor）在同一雷达图上叠加显示
- ✅ **主题适配**：雷达图自动适配深色/浅色主题
- ✅ **响应式图表**：图表随窗口大小自动调整

### 交互功能
- ✅ **悬浮提示（Tooltip）**：鼠标悬浮时显示竞品名称、维度名称和分数值
- ✅ **图例控制**：点击图例可显示/隐藏特定竞品系列
- ✅ **点击事件**：为维度点击事件添加处理器（为 v0.4.0 子维度功能预留）

### 动画效果
- ✅ **加载动画**：图表初始化时的平滑加载动画
- ✅ **数据更新动画**：数据变化时的过渡动画（1000ms cubicInOut）
- ✅ **交错动画**：多系列数据以交错方式（每系列延迟 50ms）呈现

### 数据编辑界面
- ✅ **竞品管理器（VendorEditor）**：添加/删除竞品，编辑名称和颜色
- ✅ **维度管理器（DimensionEditor）**：添加/删除维度，编辑名称和权重
- ✅ **分数编辑器（ScoreEditor）**：表格形式输入每个维度的分数（0-10）
- ✅ **权重验证**：实时显示权重总和，提示必须等于 100%
- ✅ **加权总分计算**：根据维度权重自动计算每个竞品的总分

### 图表工具栏
- ✅ **ChartToolbar 组件**：图表控制工具栏基础组件（为导出等功能预留）

## 增强功能
- ✅ **数据验证**：渲染前验证数据有效性（维度、竞品、分数范围）
- ✅ **错误处理**：数据无效时显示友好的错误提示
- ✅ **空状态 UI**：无数据时显示提示信息
- ✅ **性能优化**：使用 React.memo() 优化雷达图组件

## Bug 修复
- 🐛 **修复只读数组排序问题**：修复 Zustand Immer 中间件导致的只读数组 `sort()` 错误
  - `src/components/charts/utils.ts` - generateRadarIndicators
  - `src/components/editors/VendorEditor.tsx` - vendors 排序
  - `src/components/editors/DimensionEditor.tsx` - dimensions 排序
- 🐛 **禁用 React StrictMode**：临时禁用以避免 echarts-for-react 在严格模式下的已知问题

## 技术债务
- ⚠️ **UI 设计简陋**：当前 UI 仅为 MVP，计划在 v0.7.0 进行全面美化
- ⚠️ **缺少单元测试**：核心计算和验证函数尚未测试覆盖
- ⚠️ **缺少 Error Boundary**：需在 v0.4.0 添加以优雅处理错误
- ⚠️ **React StrictMode 禁用**：待 echarts-for-react 更新或自行封装 ECharts

## 其他说明
- 🔄 **与 v0.2.0 数据层完美集成**：图表组件直接消费 Zustand Store 数据
- 📦 **新增依赖**：
  - `echarts@^5.5.0`
  - `echarts-for-react@^3.0.2`
- 📁 **新增组件**：
  - `src/components/charts/RadarChart.tsx`
  - `src/components/charts/ChartToolbar.tsx`
  - `src/components/charts/utils.ts`
  - `src/components/charts/theme.ts`
  - `src/components/charts/types.ts`
  - `src/components/editors/VendorEditor.tsx`
  - `src/components/editors/DimensionEditor.tsx`
  - `src/components/editors/ScoreEditor.tsx`

---

# v0.2.0 - Core Data Layer - 2026-01-08

## 概述
核心数据层和状态管理，建立应用的数据基础。实现了 TypeScript 类型系统、数据验证、状态管理和本地持久化。

## 主要功能

### 数据模型
- ✅ **TypeScript 类型定义**：完整的 RadarChart、Vendor、Dimension、SubDimension 类型
- ✅ **Zod 数据验证 Schema**：确保数据格式正确和类型安全

### 状态管理
- ✅ **Zustand Store**：轻量级全局状态管理
- ✅ **Immer 中间件**：不可变状态更新
- ✅ **DevTools 支持**：开发环境调试工具集成

### 本地存储
- ✅ **IndexedDB 持久化**：使用 Dexie.js 实现本地数据存储
- ✅ **自动保存机制**：数据更新时自动保存到 IndexedDB
- ✅ **LocalStorage 降级**：IndexedDB 不可用时降级到 LocalStorage

## 增强功能
- ✅ **数据恢复**：应用启动时自动从本地存储加载数据
- ✅ **错误处理**：存储失败时的错误捕获和日志

## 其他说明
- 📦 **新增依赖**：
  - `zustand@^4.5.0`
  - `dexie@^3.2.5`
  - `dexie-react-hooks@^1.1.7`
  - `zod@^3.22.4`
  - `nanoid@^5.0.0`

---

# v0.1.0 - Project Setup - 2026-01-07

## 概述
项目基础设施搭建，创建开发环境和基础框架。

## 主要功能

### 项目初始化
- ✅ **Vite + React + TypeScript**：现代化前端开发环境
- ✅ **目录结构**：规范的项目文件组织

### UI 框架
- ✅ **Tailwind CSS**：原子化 CSS 框架
- ✅ **Shadcn/ui**：高质量 React 组件库
- ✅ **主题切换**：深色/浅色模式支持

### 代码规范
- ✅ **ESLint**：代码质量检查
- ✅ **Prettier**：代码格式化
- ✅ **Git Hooks**：提交前自动检查

### 部署配置
- ✅ **Vercel 部署**：自动化 CI/CD 配置
- ✅ **环境变量**：环境配置管理

### 国际化
- ✅ **react-i18next**：中英文界面切换
- ✅ **语言切换组件**：Header 中的语言选择器

## 其他说明
- 📦 **核心依赖**：
  - `react@^18.3.1`
  - `react-dom@^18.3.1`
  - `vite@^5.1.0`
  - `typescript@^5.3.3`
  - `tailwindcss@^3.4.1`
  - `react-i18next@^14.0.0`
  - `next-themes@^0.2.1`
  - `lucide-react@^0.344.0`

---

## 版本计划预告

### v0.4.0 - Complete Data Management (下一个版本)
- 雷达图 Tab 导航和拖拽排序
- 完整的竞品和维度管理
- 子维度编辑和自动计算
- 维度拖拽排序
- 总分计算和排名

### v0.5.0 - Import Export
- Excel 导入导出
- JSON 导入导出
- 图片导出（PNG/SVG）
- 模板下载

### v0.6.0 - Share and Collaborate
- 分享链接生成
- 只读/可编辑模式
- Vercel KV 数据存储

### v0.7.0 - UI/UX Polish
- 响应式布局优化
- 动画效果优化
- 错误处理优化
- 性能优化

### v1.0.0 - Production Release
- 生产环境部署
- 用户文档
- 团队培训
