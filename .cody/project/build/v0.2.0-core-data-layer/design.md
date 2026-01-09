# Version Design Document : v0.2.0 - Core Data Layer
Technical implementation and design guide for the upcoming version.

## 1. Features Summary
_Overview of features included in this version._

本版本专注于建立应用的核心数据层和状态管理基础设施，为后续的数据可视化和管理功能提供坚实的数据支撑。包含以下 5 个核心功能：

### V02-1: 数据模型设计
- 定义完整的 TypeScript 接口（RadarChart、Vendor、Dimension、SubDimension 等）
- 建立清晰的数据结构和关系
- 确保类型安全和代码提示

### V02-2: 数据验证 Schema
- 使用 Zod 定义数据验证规则
- 实现运行时类型检查
- 提供友好的错误提示

### V02-3: Zustand Store
- 创建全局状态管理 Store
- 实现数据的 CRUD 操作
- 管理应用状态（当前激活的雷达图、编辑模式等）

### V02-4: IndexedDB 存储服务
- 使用 Dexie.js 实现本地持久化
- 支持复杂数据结构存储
- 提供数据库版本管理和迁移机制

### V02-5: 自动保存机制
- 实现数据变更监听
- 自动保存到 IndexedDB
- 应用启动时自动恢复数据
- 提供手动备份和恢复功能

## 2. Technical Architecture Overview
_High-level technical structure that supports all features in this version._

### 技术栈
- **状态管理**: Zustand 4.5+
- **数据验证**: Zod 3.22+
- **本地存储**: Dexie.js 3.2+ (IndexedDB 封装)
- **工具库**: nanoid (生成唯一 ID)
- **TypeScript**: 5.3+ (严格模式)

### 数据流架构
```
┌─────────────────────────────────────────────────┐
│                 React 组件层                      │
│  - 使用 Zustand hooks 读取和更新状态             │
└─────────────────┬───────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────┐
│              Zustand Store 层                    │
│  - 管理全局状态 (radarCharts, activeChartId)    │
│  - 提供 actions (CRUD 操作)                      │
│  - 数据变更时触发保存                             │
└─────────────────┬───────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────┐
│            数据验证层 (Zod)                       │
│  - 验证数据格式                                   │
│  - 确保数据完整性                                 │
└─────────────────┬───────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────┐
│         本地存储层 (Dexie.js)                     │
│  - IndexedDB 数据库操作                          │
│  - 数据持久化和恢复                               │
└─────────────────────────────────────────────────┘
```

### 项目目录结构（新增）
```
src/
├── types/                  # TypeScript 类型定义
│   ├── index.ts            # 导出所有类型
│   ├── radar.ts            # 雷达图相关类型
│   ├── vendor.ts           # 竞品系列类型
│   └── dimension.ts        # 维度类型
├── schemas/                # Zod 验证 Schema
│   ├── index.ts            # 导出所有 Schema
│   ├── radarSchema.ts      # 雷达图 Schema
│   ├── vendorSchema.ts     # 竞品 Schema
│   └── dimensionSchema.ts  # 维度 Schema
├── store/                  # Zustand Store
│   ├── index.ts            # Store 导出
│   ├── radarStore.ts       # 雷达图 Store
│   └── types.ts            # Store 类型定义
├── services/               # 业务服务
│   ├── storage/            # 存储服务
│   │   ├── db.ts           # Dexie 数据库定义
│   │   ├── radarService.ts # 雷达图存储操作
│   │   └── types.ts        # 存储服务类型
│   └── validators/         # 数据验证服务
│       └── index.ts        # 验证工具函数
└── lib/                    # 工具函数
    ├── utils.ts            # 通用工具
    └── constants.ts        # 常量定义
```

## 3. Implementation Notes
_Shared technical considerations across all features in this version._

### 数据模型设计原则

#### 核心实体关系
```
RadarChart (1) ──> (N) Vendor
RadarChart (1) ──> (N) Dimension
Dimension (1) ──> (N) SubDimension
```

#### TypeScript 接口定义

**RadarChart（雷达图）**
```typescript
interface RadarChart {
  id: string;                  // 唯一标识 (nanoid)
  name: string;                // 雷达图名称
  createdAt: Date;             // 创建时间
  updatedAt: Date;             // 更新时间
  vendors: Vendor[];           // 竞品系列列表
  dimensions: Dimension[];     // 一级维度列表
}
```

**Vendor（竞品系列）**
```typescript
interface Vendor {
  id: string;                  // 唯一标识
  name: string;                // 系列名称（如 "Omada"）
  color: string;               // 颜色（HEX 格式）
  symbol: SymbolType;          // 标记类型
  order: number;               // 排序序号
}

type SymbolType = 'circle' | 'rect' | 'triangle' | 'diamond';
```

**Dimension（一级维度）**
```typescript
interface Dimension {
  id: string;                  // 唯一标识
  name: string;                // 维度名称
  description?: string;        // 维度说明（评分标准）
  weight: number;              // 权重（0-100，总和 100%）
  order: number;               // 排序序号
  scores: Record<string, number>;  // 每个 Vendor 的分数 { vendorId: score }
  subDimensions?: SubDimension[];  // 子维度（可选）
}
```

**SubDimension（子维度）**
```typescript
interface SubDimension {
  id: string;                  // 唯一标识
  name: string;                // 子维度名称
  description?: string;        // 子维度说明
  weight: number;              // 在父维度内的权重（0-100，总和 100%）
  order: number;               // 排序序号
  scores: Record<string, number>;  // 每个 Vendor 的分数 { vendorId: score }
}
```

**AppState（应用状态）**
```typescript
interface AppState {
  radarCharts: RadarChart[];   // 所有雷达图
  activeChartId: string | null; // 当前激活的雷达图 ID
  isLoading: boolean;          // 加载状态
  lastSaved: Date | null;      // 最后保存时间
}
```

### Zod Schema 设计

**验证规则**
- 分数范围：0-10（整数）
- 权重范围：0-100（总和必须为 100%）
- 名称：非空字符串，最大长度 100
- 描述：可选字符串，最大长度 500
- 颜色：HEX 格式（#RRGGBB）

**示例 Schema**
```typescript
const VendorSchema = z.object({
  id: z.string(),
  name: z.string().min(1, '名称不能为空').max(100, '名称过长'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, '颜色格式错误'),
  symbol: z.enum(['circle', 'rect', 'triangle', 'diamond']),
  order: z.number().int().min(0),
});

const DimensionSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  weight: z.number().min(0).max(100),
  order: z.number().int().min(0),
  scores: z.record(z.string(), z.number().min(0).max(10).int()),
  subDimensions: z.array(SubDimensionSchema).optional(),
});
```

**自定义验证**
```typescript
// 验证维度权重总和为 100%
const validateDimensionWeights = (dimensions: Dimension[]) => {
  const total = dimensions.reduce((sum, dim) => sum + dim.weight, 0);
  if (Math.abs(total - 100) > 0.01) {
    throw new Error(`维度权重总和必须为 100%，当前为 ${total}%`);
  }
};

// 验证子维度权重总和为 100%
const validateSubDimensionWeights = (subDimensions: SubDimension[]) => {
  const total = subDimensions.reduce((sum, sub) => sum + sub.weight, 0);
  if (Math.abs(total - 100) > 0.01) {
    throw new Error(`子维度权重总和必须为 100%，当前为 ${total}%`);
  }
};
```

### Zustand Store 设计

**Store 结构**
```typescript
interface RadarStore extends AppState {
  // Actions
  addRadarChart: (name: string) => void;
  updateRadarChart: (id: string, updates: Partial<RadarChart>) => void;
  deleteRadarChart: (id: string) => void;
  setActiveChart: (id: string | null) => void;

  addVendor: (chartId: string, vendor: Omit<Vendor, 'id'>) => void;
  updateVendor: (chartId: string, vendorId: string, updates: Partial<Vendor>) => void;
  deleteVendor: (chartId: string, vendorId: string) => void;

  addDimension: (chartId: string, dimension: Omit<Dimension, 'id'>) => void;
  updateDimension: (chartId: string, dimensionId: string, updates: Partial<Dimension>) => void;
  deleteDimension: (chartId: string, dimensionId: string) => void;

  addSubDimension: (chartId: string, dimensionId: string, subDimension: Omit<SubDimension, 'id'>) => void;
  updateSubDimension: (chartId: string, dimensionId: string, subDimensionId: string, updates: Partial<SubDimension>) => void;
  deleteSubDimension: (chartId: string, dimensionId: string, subDimensionId: string) => void;

  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}
```

**中间件**
- **persist middleware**: 自动保存到 IndexedDB
- **devtools middleware**: 开发调试工具（可选）

### Dexie.js 数据库设计

**数据库结构**
```typescript
class RadarDatabase extends Dexie {
  radarCharts!: Table<RadarChart>;
  appSettings!: Table<{ key: string; value: any }>;

  constructor() {
    super('RadarBenchDB');
    this.version(1).stores({
      radarCharts: 'id, name, createdAt, updatedAt',
      appSettings: 'key',
    });
  }
}

const db = new RadarDatabase();
```

**存储操作**
```typescript
// 保存雷达图
const saveRadarChart = async (chart: RadarChart) => {
  await db.radarCharts.put(chart);
};

// 获取所有雷达图
const getAllRadarCharts = async () => {
  return await db.radarCharts.toArray();
};

// 删除雷达图
const deleteRadarChart = async (id: string) => {
  await db.radarCharts.delete(id);
};

// 保存应用设置
const saveAppSettings = async (key: string, value: any) => {
  await db.appSettings.put({ key, value });
};

// 获取应用设置
const getAppSettings = async (key: string) => {
  const result = await db.appSettings.get(key);
  return result?.value;
};
```

### 自动保存机制

**实现方案**
1. **监听 Store 变化**: 使用 Zustand 的 `subscribe` 监听状态变化
2. **防抖保存**: 使用 debounce 避免频繁保存（300ms 延迟）
3. **保存标识**: 更新 `lastSaved` 时间戳
4. **加载时恢复**: 应用启动时从 IndexedDB 加载数据

**代码示例**
```typescript
// 在 Store 创建后订阅变化
let saveTimeout: NodeJS.Timeout;
useRadarStore.subscribe((state) => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    state.saveToStorage();
  }, 300);
});

// 应用启动时加载
useEffect(() => {
  useRadarStore.getState().loadFromStorage();
}, []);
```

## 4. Other Technical Considerations
_Shared any other technical information that might be relevant to building this version._

### 性能优化
- **选择性订阅**: 使用 Zustand 的 selector 避免不必要的重渲染
- **Immer 集成**: 使用 immer middleware 简化不可变更新
- **索引优化**: Dexie 数据库使用索引加速查询

### 错误处理
- **Zod 验证错误**: 捕获并转换为用户友好的提示
- **IndexedDB 错误**: 处理浏览器不支持或配额超限的情况
- **降级方案**: IndexedDB 不可用时降级到 LocalStorage

### 数据迁移
- **版本控制**: Dexie 支持数据库 schema 版本管理
- **迁移脚本**: 预留未来数据结构变更的迁移逻辑

### 测试考虑
- **单元测试**: 测试 Store actions 和验证逻辑
- **集成测试**: 测试 IndexedDB 存储和恢复流程
- **Mock 数据**: 创建测试用的示例数据

### TypeScript 严格模式
- 所有类型必须明确定义
- 避免使用 `any`
- 使用 `strict` 模式捕获潜在错误

## 5. Open Questions
_Unresolved technical or product questions affecting this version._

### Q1: 是否需要数据版本历史？
- **问题**: 用户是否需要撤销/重做功能？
- **建议**: v1.0 不实现，先关注核心功能
- **决策**: 暂不实现，留作未来优化

### Q2: 权重自动调整策略
- **问题**: 用户修改一个维度权重时，如何自动调整其他维度？
  - 方案 A: 平均分配剩余权重
  - 方案 B: 按比例调整其他维度
  - 方案 C: 不自动调整，提示用户手动修改
- **建议**: v0.2.0 先实现方案 C（最简单），v0.4.0 再优化用户体验
- **决策**: 方案 C

### Q3: 默认数据
- **问题**: 首次启动时是否创建示例雷达图？
- **建议**: 创建一个示例数据，帮助用户快速理解功能
- **决策**: 创建示例数据

### Q4: 数据导出格式
- **问题**: IndexedDB 中的数据以什么格式保存？
  - 方案 A: 直接保存原始对象
  - 方案 B: 序列化为 JSON 字符串
- **建议**: 方案 A（Dexie 原生支持对象存储）
- **决策**: 接受建议

### Q5: 是否需要数据备份功能？
- **问题**: 用户是否需要手动导出备份到本地文件？
- **建议**: v0.2.0 暂不实现，v0.5.0 通过导出功能实现
- **决策**: 暂不实现
