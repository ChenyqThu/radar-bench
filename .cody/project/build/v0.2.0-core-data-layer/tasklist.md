# Version Tasklist – v0.2.0 - Core Data Layer
This document outlines all the tasks to work on to deliver this particular version, grouped by phases.

| Status |      |
|--------|------|
| 🔴 | Not Started |
| 🟡 | In Progress |
| 🟢 | Completed |

---

## Phase 1: 依赖安装和项目结构

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| P1-1 | 安装核心依赖 | 安装 zustand, zod, dexie, dexie-react-hooks, nanoid | None | 🟢 Completed | AGENT |
| P1-2 | 安装类型定义 | 安装 @types/node (如需要) | P1-1 | 🟢 Completed | AGENT |
| P1-3 | 创建目录结构 | 创建 src/types, src/schemas, src/store, src/services/storage, src/services/validators | None | 🟢 Completed | AGENT |
| P1-4 | 创建常量文件 | 创建 src/lib/constants.ts，定义默认值、颜色等 | P1-3 | 🟢 Completed | AGENT |
| P1-5 | 测试依赖安装 | 运行 pnpm dev 确保项目正常启动 | P1-1, P1-2 | 🟢 Completed | AGENT |

---

## Phase 2: 数据模型和 TypeScript 类型定义

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| P2-1 | 定义 Vendor 类型 | 创建 src/types/vendor.ts，定义 Vendor 和 SymbolType | P1-3 | 🟢 Completed | AGENT |
| P2-2 | 定义 Dimension 类型 | 创建 src/types/dimension.ts，定义 Dimension 和 SubDimension | P1-3 | 🟢 Completed | AGENT |
| P2-3 | 定义 RadarChart 类型 | 创建 src/types/radar.ts，定义 RadarChart 和 AppState | P2-1, P2-2 | 🟢 Completed | AGENT |
| P2-4 | 创建类型导出文件 | 创建 src/types/index.ts，统一导出所有类型 | P2-1, P2-2, P2-3 | 🟢 Completed | AGENT |
| P2-5 | 验证类型定义 | 创建测试文件验证类型定义正确且无循环依赖 | P2-4 | 🟢 Completed | AGENT |

---

## Phase 3: Zod 数据验证 Schema

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| P3-1 | 创建 Vendor Schema | 创建 src/schemas/vendorSchema.ts，定义 VendorSchema | P2-1 | 🟢 Completed | AGENT |
| P3-2 | 创建 Dimension Schema | 创建 src/schemas/dimensionSchema.ts，定义 DimensionSchema 和 SubDimensionSchema | P2-2 | 🟢 Completed | AGENT |
| P3-3 | 创建 RadarChart Schema | 创建 src/schemas/radarSchema.ts，定义 RadarChartSchema | P3-1, P3-2 | 🟢 Completed | AGENT |
| P3-4 | 创建自定义验证函数 | 在 src/services/validators/index.ts 创建权重验证函数 | P3-2 | 🟢 Completed | AGENT |
| P3-5 | 创建 Schema 导出文件 | 创建 src/schemas/index.ts，统一导出所有 Schema | P3-1, P3-2, P3-3 | 🟢 Completed | AGENT |
| P3-6 | 测试数据验证 | 创建测试用例验证 Schema 正确捕获错误 | P3-5 | 🟢 Completed | AGENT |

---

## Phase 4: Zustand Store 实现

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| P4-1 | 创建 Store 类型定义 | 创建 src/store/types.ts，定义 RadarStore 接口 | P2-4 | 🟢 Completed | AGENT |
| P4-2 | 创建基础 Store | 创建 src/store/radarStore.ts，初始化 Zustand Store 和状态 | P4-1 | 🟢 Completed | AGENT |
| P4-3 | 实现 RadarChart CRUD | 在 Store 中实现 addRadarChart, updateRadarChart, deleteRadarChart, setActiveChart | P4-2 | 🟢 Completed | AGENT |
| P4-4 | 实现 Vendor CRUD | 在 Store 中实现 addVendor, updateVendor, deleteVendor | P4-2 | 🟢 Completed | AGENT |
| P4-5 | 实现 Dimension CRUD | 在 Store 中实现 addDimension, updateDimension, deleteDimension | P4-2 | 🟢 Completed | AGENT |
| P4-6 | 实现 SubDimension CRUD | 在 Store 中实现 addSubDimension, updateSubDimension, deleteSubDimension | P4-2 | 🟢 Completed | AGENT |
| P4-7 | 添加 Immer 中间件 | 集成 immer middleware 简化不可变更新 | P4-2 | 🟢 Completed | AGENT |
| P4-8 | 添加 Devtools 中间件 | 集成 devtools middleware（开发环境）| P4-2 | 🟢 Completed | AGENT |
| P4-9 | 创建 Store 导出文件 | 创建 src/store/index.ts，导出 Store hooks | P4-3, P4-4, P4-5, P4-6 | 🟢 Completed | AGENT |
| P4-10 | 测试 Store Actions | 创建简单的测试组件验证 Store 操作正常 | P4-9 | 🟢 Completed | AGENT |

---

## Phase 5: IndexedDB 存储服务（Dexie.js）

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| P5-1 | 定义存储服务类型 | 创建 src/services/storage/types.ts，定义存储服务接口 | P2-4 | 🟢 Completed | AGENT |
| P5-2 | 创建 Dexie 数据库 | 创建 src/services/storage/db.ts，定义 RadarDatabase 类 | P5-1 | 🟢 Completed | AGENT |
| P5-3 | 实现雷达图存储服务 | 创建 src/services/storage/radarService.ts，实现 CRUD 操作 | P5-2 | 🟢 Completed | AGENT |
| P5-4 | 实现应用设置存储 | 在 radarService.ts 中实现 saveAppSettings, getAppSettings | P5-2 | 🟢 Completed | AGENT |
| P5-5 | 添加错误处理 | 实现 IndexedDB 错误捕获和 LocalStorage 降级方案 | P5-3, P5-4 | 🟢 Completed | AGENT |
| P5-6 | 测试存储服务 | 创建测试验证数据能正确保存和读取 | P5-5 | 🟢 Completed | AGENT |

---

## Phase 6: 自动保存机制和 Store 集成

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| P6-1 | 实现 loadFromStorage | 在 Store 中实现从 IndexedDB 加载数据 | P4-9, P5-3 | 🟢 Completed | AGENT |
| P6-2 | 实现 saveToStorage | 在 Store 中实现保存数据到 IndexedDB | P4-9, P5-3 | 🟢 Completed | AGENT |
| P6-3 | 添加自动保存订阅 | 使用 Store.subscribe 监听状态变化并防抖保存 | P6-2 | 🟢 Completed | AGENT |
| P6-4 | 更新 lastSaved 时间 | 在保存成功后更新 lastSaved 状态 | P6-2 | 🟢 Completed | AGENT |
| P6-5 | 添加加载状态 | 在数据加载时设置 isLoading 状态 | P6-1 | 🟢 Completed | AGENT |
| P6-6 | 应用启动时加载数据 | 在 App.tsx 或 main.tsx 中调用 loadFromStorage | P6-1, P6-5 | 🟢 Completed | AGENT |
| P6-7 | 测试自动保存 | 验证数据修改后自动保存，刷新页面后数据恢复 | P6-3, P6-6 | 🟢 Completed | AGENT |

---

## Phase 7: 示例数据和文档

| ID  | Task             | Description                             | Dependencies | Status | Assigned To |
|-----|------------------|-----------------------------------------|-------------|----------|--------|
| P7-1 | 创建示例数据生成器 | 创建 src/lib/mockData.ts，生成示例 RadarChart | P2-4 | 🟢 Completed | AGENT |
| P7-2 | 定义示例数据内容 | 定义 2 个 Vendors（Omada, Competitor）和 4-6 个 Dimensions | P7-1 | 🟢 Completed | AGENT |
| P7-3 | 首次启动加载示例 | 在 loadFromStorage 中检测无数据时加载示例 | P6-1, P7-2 | 🟢 Completed | AGENT |
| P7-4 | 创建测试用 UI 组件 | 创建简单的调试组件显示 Store 状态（可选）| Phase 4, 6 完成 | 🟢 Completed | AGENT |
| P7-5 | 更新 README 文档 | 在 README 中添加数据层架构说明 | Phase 1-6 完成 | 🟢 Completed | AGENT |
| P7-6 | 清理调试代码 | 移除开发过程中的 console.log 和临时代码 | Phase 1-6 完成 | 🟢 Completed | AGENT |
| P7-7 | 最终测试 | 完整测试数据层所有功能（创建、编辑、删除、持久化）| P7-6 | 🔴 Not Started | USER |
| P7-8 | Git 提交 | 提交所有代码并推送到远程仓库 | P7-7 | 🔴 Not Started | USER |

---

## 总结

**总任务数**: 47 个任务
**阶段数**: 7 个阶段
**预计时间**: 根据实际开发速度调整

**关键依赖链**:
1. Phase 1（依赖和结构）→ Phase 2（类型定义）→ Phase 3（验证 Schema）
2. Phase 2 → Phase 4（Zustand Store）
3. Phase 2 → Phase 5（IndexedDB 存储）
4. Phase 4 + Phase 5 → Phase 6（自动保存集成）
5. Phase 6 → Phase 7（示例数据和收尾）

**注意事项**:
- Phase 3 和 Phase 5 可以部分并行开发
- Phase 4 依赖 Phase 2，但可以在 Phase 3 完成前开始
- 每个 Phase 完成后建议进行测试，确保功能正常
- 最后的 Git 提交前请运行完整的构建和类型检查
