# 版本设计文档: v0.4.0 - 完整数据管理
完整的数据管理功能的技术实现和设计指南。

## 1. 功能概述
本版本将实现完整的数据管理功能，包括多雷达图管理、竞品系列管理、维度与子维度管理、拖拽排序、权重验证和自动计算等核心能力。这是产品从 MVP 向完整可用版本的关键升级。

### v0.4.0 包含的功能:

| ID | 功能 | 描述 | 优先级 |
|----|---------|-------------|---------|
| V04-1 | 雷达图 Tab 导航 | 实现多雷达图切换、新增、删除、重命名 | 🔥 High |
| V04-2 | Tab 拖拽排序 | 使用 dnd-kit 实现 Tab 拖拽排序 | 📌 Medium |
| V04-3 | 竞品系列管理 | 实现 Vendor 增删改、颜色选择、标记类型设置 | 🔥 High |
| V04-4 | 维度管理表格 | 实现一级维度的增删改、权重设置、分数输入 | 🔥 High |
| V04-5 | 权重验证 | 实现维度权重总和 100% 的验证和提示 | 🔥 High |
| V04-6 | 子维度编辑器 | 实现子维度的展开/收起、增删改 | 🔥 High |
| V04-7 | 子维度自动计算 | 根据子维度权重自动计算父维度分数 | 🔥 High |
| V04-8 | 子维度雷达图 | 实现子维度级联展开的雷达图 | 📌 Medium |
| V04-9 | 维度拖拽排序 | 实现维度和子维度的拖拽排序 | 📌 Medium |
| V04-10 | 总分计算和排名 | 实时计算总分并展示排名 | 🔥 High |

### 核心交付物:
- 完整的多雷达图管理界面（Tab 导航 + 拖拽排序）
- 功能齐全的竞品系列管理器
- 强大的维度和子维度编辑能力
- 智能的权重验证和自动计算系统
- 实时的总分计算和排名展示

## 2. 技术架构概览

### 已有基础 (v0.1.0 - v0.3.0):
- ✅ React 18 + TypeScript + Vite
- ✅ Shadcn/ui + Tailwind CSS（苹果风格）
- ✅ Zustand 状态管理
- ✅ IndexedDB 本地存储 (Dexie.js)
- ✅ react-i18next 国际化
- ✅ ECharts 雷达图可视化
- ✅ 主题切换（深色/浅色）

### v0.4.0 新增依赖:
```json
{
  "@dnd-kit/core": "^6.1.0",
  "@dnd-kit/sortable": "^8.0.0",
  "@dnd-kit/utilities": "^3.2.2",
  "react-colorful": "^5.6.1",
  "lucide-react": "^0.344.0"
}
```

### 新增 Shadcn/ui 组件:
```bash
# 已有：Button, Card, Input, Label, Dropdown Menu, Switch
# 新增：
npx shadcn-ui@latest add table
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add select
npx shadcn-ui@latest add popover
```

### 组件架构:
```
src/
├── components/
│   ├── charts/
│   │   ├── RadarChart.tsx          # 主雷达图（已有）
│   │   ├── SubRadarChart.tsx       # 【新增】子维度雷达图
│   │   └── ChartToolbar.tsx        # 工具栏（已有）
│   ├── radar/
│   │   ├── RadarTabBar.tsx         # 【新增】雷达图 Tab 导航栏
│   │   ├── RadarTabItem.tsx        # 【新增】单个 Tab 项
│   │   └── CreateRadarDialog.tsx   # 【新增】新建雷达图对话框
│   ├── vendors/
│   │   ├── VendorManager.tsx       # 【新增】竞品系列管理器
│   │   ├── VendorList.tsx          # 【新增】系列列表
│   │   ├── VendorItem.tsx          # 【新增】系列项（拖拽）
│   │   ├── VendorForm.tsx          # 【新增】系列表单
│   │   └── ColorPicker.tsx         # 【新增】颜色选择器
│   ├── dimensions/
│   │   ├── DimensionTable.tsx      # 【新增】维度表格（替代 DimensionEditor）
│   │   ├── DimensionRow.tsx        # 【新增】维度行（拖拽）
│   │   ├── SubDimensionRow.tsx     # 【新增】子维度行（嵌套展示）
│   │   ├── DimensionForm.tsx       # 【新增】维度表单
│   │   ├── WeightValidator.tsx     # 【新增】权重验证组件
│   │   └── ScoreInputCell.tsx      # 【新增】分数输入单元格
│   ├── scoreboard/
│   │   ├── ScoreBoard.tsx          # 【新增】总分展示面板
│   │   └── RankingList.tsx         # 【新增】排名列表
│   ├── editors/                    # 保留用于简单编辑
│   │   ├── DimensionEditor.tsx     # v0.3.0 简单编辑器
│   │   ├── VendorEditor.tsx        # v0.3.0 简单编辑器
│   │   └── ScoreEditor.tsx         # v0.3.0 简单编辑器
│   └── ui/                         # Shadcn 组件库
├── hooks/
│   ├── useDragAndDrop.ts           # 【新增】拖拽通用 Hook
│   ├── useWeightValidation.ts      # 【新增】权重验证 Hook
│   └── useAutoCalculate.ts         # 【新增】自动计算 Hook
└── lib/
    ├── calculations.ts             # 【新增】分数计算工具
    ├── validators.ts               # 【新增】数据验证工具
    └── dndHelpers.ts               # 【新增】拖拽辅助函数
```

### 数据流:
```
用户操作 → 组件 (Table/Form/Tab) → Zustand Actions → IndexedDB (自动保存)
                                          ↓
                                    验证 + 计算
                                          ↓
                                    更新 UI
                                          ↓
                               触发雷达图重新渲染
```

## 3. 实现要点

### 3.1 雷达图 Tab 导航 (V04-1, V04-2)

#### 数据结构扩展:
```typescript
// 已有结构保持不变，添加 order 字段
interface RadarChart {
  id: string;
  name: string;
  order: number;           // 【新增】排序序号
  createdAt: Date;
  updatedAt: Date;
  vendors: Vendor[];
  dimensions: Dimension[];
}
```

#### Tab 导航实现:
- 使用 Shadcn `Tabs` 组件作为基础
- 自定义 TabsList 以支持拖拽和额外操作按钮
- 实现右键菜单：重命名、复制、删除
- 新增按钮：固定在 TabsList 右侧

#### 拖拽排序 (dnd-kit):
```typescript
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';

// RadarTabBar 组件
function RadarTabBar() {
  const { radarCharts, reorderCharts } = useRadarStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderCharts(active.id as string, over.id as string);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={radarCharts.map(c => c.id)}
        strategy={horizontalListSortingStrategy}
      >
        {radarCharts.map(chart => (
          <RadarTabItem key={chart.id} chart={chart} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
```

#### Store Actions:
```typescript
// Zustand Store 新增 actions
reorderCharts: (activeId: string, overId: string) => void;
createRadarChart: (name: string) => void;
deleteRadarChart: (id: string) => void;
renameRadarChart: (id: string, name: string) => void;
duplicateRadarChart: (id: string) => void;
```

### 3.2 竞品系列管理 (V04-3)

#### 设计原则:
- 侧边栏或可折叠面板
- 列表形式展示所有系列，支持拖拽排序
- 内联编辑：点击名称直接编辑
- 颜色选择器：使用 `react-colorful` 的 HexColorPicker
- 标记类型选择：Circle、Rect、Triangle、Diamond

#### 组件设计:
```typescript
// VendorManager.tsx
function VendorManager() {
  const { activeChart, addVendor, updateVendor, deleteVendor, reorderVendors } = useRadarStore();
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{t('vendors.title')}</h3>
        <Button onClick={() => addVendor({ name: t('vendors.newVendor') })}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext items={activeChart.vendors.map(v => v.id)}>
          {activeChart.vendors.map(vendor => (
            <VendorItem
              key={vendor.id}
              vendor={vendor}
              isEditing={editingId === vendor.id}
              onEdit={() => setEditingId(vendor.id)}
              onUpdate={updateVendor}
              onDelete={() => deleteVendor(vendor.id)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </Card>
  );
}
```

#### 颜色选择器:
```typescript
// ColorPicker.tsx
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="w-8 h-8 rounded border-2 border-gray-300"
          style={{ backgroundColor: color }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3">
        <HexColorPicker color={color} onChange={onChange} />
      </PopoverContent>
    </Popover>
  );
}
```

### 3.3 维度管理表格 (V04-4, V04-5, V04-9)

#### 表格设计:
使用 Shadcn `Table` 组件 + TanStack Table（可选，如需高级功能）

**表格列结构:**
| 拖拽 | 维度名称 | 权重(%) | Vendor A 分数 | Vendor B 分数 | ... | 操作 |
|------|----------|---------|---------------|---------------|-----|------|

#### 关键特性:
1. **拖拽排序**: 使用 dnd-kit 的 `verticalListSortingStrategy`
2. **展开/收起**: 点击维度行展开子维度（类似文件树）
3. **内联编辑**: 双击单元格直接编辑
4. **权重验证**: 实时显示总和，不等于 100% 时高亮警告

#### 实现示例:
```typescript
// DimensionTable.tsx
function DimensionTable() {
  const { activeChart, updateDimension, reorderDimensions } = useRadarStore();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const totalWeight = activeChart.dimensions.reduce((sum, d) => sum + d.weight, 0);
  const isWeightValid = totalWeight === 100;

  return (
    <div>
      {/* 权重验证提示 */}
      <WeightValidator total={totalWeight} isValid={isWeightValid} />

      {/* 表格 */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>{t('dimension.name')}</TableHead>
            <TableHead className="w-24">{t('dimension.weight')}</TableHead>
            {activeChart.vendors.map(v => (
              <TableHead key={v.id} className="w-24">{v.name}</TableHead>
            ))}
            <TableHead className="w-24">{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <DndContext onDragEnd={handleDragEnd}>
          <SortableContext items={activeChart.dimensions.map(d => d.id)}>
            <TableBody>
              {activeChart.dimensions.map(dimension => (
                <DimensionRow
                  key={dimension.id}
                  dimension={dimension}
                  vendors={activeChart.vendors}
                  isExpanded={expandedIds.has(dimension.id)}
                  onToggleExpand={() => toggleExpand(dimension.id)}
                  onUpdate={updateDimension}
                />
              ))}
            </TableBody>
          </SortableContext>
        </DndContext>
      </Table>
    </div>
  );
}
```

#### 权重验证组件:
```typescript
// WeightValidator.tsx
function WeightValidator({ total, isValid }: { total: number; isValid: boolean }) {
  if (isValid) {
    return (
      <Alert className="mb-4 border-green-500 bg-green-50 dark:bg-green-950">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription>{t('validation.weightValid')}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 border-amber-500 bg-amber-50 dark:bg-amber-950">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertDescription>
        {t('validation.weightInvalid', { total })}
      </AlertDescription>
    </Alert>
  );
}
```

### 3.4 子维度编辑器 (V04-6, V04-7)

#### 展开/收起逻辑:
- 子维度嵌套在父维度行下方
- 使用缩进 + 不同背景色区分层级
- 展开时显示子维度行，每个子维度也支持拖拽排序

#### 自动计算逻辑:
```typescript
// lib/calculations.ts
/**
 * 根据子维度权重和分数，自动计算父维度分数
 */
export function calculateParentScore(
  subDimensions: SubDimension[],
  vendorId: string
): number {
  if (!subDimensions.length) return 0;

  const totalWeight = subDimensions.reduce((sum, sub) => sum + sub.weight, 0);
  if (totalWeight === 0) return 0;

  const weightedSum = subDimensions.reduce((sum, sub) => {
    const score = sub.scores[vendorId] || 0;
    return sum + (score * sub.weight);
  }, 0);

  return Math.round((weightedSum / totalWeight) * 10) / 10; // 保留 1 位小数
}
```

#### Hook 实现:
```typescript
// hooks/useAutoCalculate.ts
function useAutoCalculate(dimensionId: string) {
  const { activeChart, updateDimension } = useRadarStore();
  const dimension = activeChart.dimensions.find(d => d.id === dimensionId);

  useEffect(() => {
    if (!dimension?.subDimensions?.length) return;

    const newScores = { ...dimension.scores };
    activeChart.vendors.forEach(vendor => {
      newScores[vendor.id] = calculateParentScore(dimension.subDimensions!, vendor.id);
    });

    // 只在分数变化时更新
    if (!isEqual(newScores, dimension.scores)) {
      updateDimension(dimensionId, { scores: newScores });
    }
  }, [dimension?.subDimensions, activeChart.vendors]);
}
```

#### 子维度权重验证:
- 与父维度相同的逻辑，但作用域限定在单个父维度内
- 每个父维度的子维度权重总和必须为 100%
- 在展开的子维度区域显示独立的验证提示

### 3.5 子维度雷达图 (V04-8)

#### 交互设计:
- 点击主雷达图中的某个维度
- 侧边滑出子维度雷达图（或模态框）
- 显示该维度下所有子维度的对比

#### 组件实现:
```typescript
// SubRadarChart.tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import ReactECharts from 'echarts-for-react';

interface SubRadarChartProps {
  dimension: Dimension | null;
  vendors: Vendor[];
  isOpen: boolean;
  onClose: () => void;
}

function SubRadarChart({ dimension, vendors, isOpen, onClose }: SubRadarChartProps) {
  if (!dimension?.subDimensions) return null;

  const option: EChartsOption = {
    title: { text: dimension.name, left: 'center' },
    legend: {
      data: vendors.map(v => v.name),
      bottom: 0
    },
    radar: {
      indicator: dimension.subDimensions.map(sub => ({
        name: sub.name,
        max: 10
      }))
    },
    series: [{
      type: 'radar',
      data: vendors.map(vendor => ({
        name: vendor.name,
        value: dimension.subDimensions!.map(sub => sub.scores[vendor.id] || 0),
        itemStyle: { color: vendor.color }
      }))
    }]
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[600px]">
        <SheetHeader>
          <SheetTitle>{t('subDimension.chartTitle', { name: dimension.name })}</SheetTitle>
        </SheetHeader>
        <ReactECharts option={option} style={{ height: '500px', marginTop: '20px' }} />
      </SheetContent>
    </Sheet>
  );
}
```

#### 触发方式:
```typescript
// RadarChart.tsx 中添加点击事件
const onChartClick = (params: any) => {
  if (params.componentType === 'radar') {
    const dimensionIndex = params.dataIndex;
    const dimension = activeChart.dimensions[dimensionIndex];
    setSelectedDimension(dimension);
  }
};

<ReactECharts
  option={option}
  onEvents={{ click: onChartClick }}
  style={{ height: '600px' }}
/>
```

### 3.6 总分计算和排名 (V04-10)

#### 计算逻辑:
```typescript
// lib/calculations.ts
/**
 * 计算竞品的加权总分
 */
export function calculateTotalScore(
  dimensions: Dimension[],
  vendorId: string
): number {
  const totalWeight = dimensions.reduce((sum, d) => sum + d.weight, 0);
  if (totalWeight === 0) return 0;

  const weightedSum = dimensions.reduce((sum, d) => {
    const score = d.scores[vendorId] || 0;
    return sum + (score * d.weight / 100);
  }, 0);

  return Math.round(weightedSum * 100) / 100; // 保留 2 位小数
}

/**
 * 生成排名列表
 */
export function getRankings(
  dimensions: Dimension[],
  vendors: Vendor[]
): Array<{ vendor: Vendor; score: number; rank: number }> {
  const scores = vendors.map(vendor => ({
    vendor,
    score: calculateTotalScore(dimensions, vendor.id),
    rank: 0
  }));

  // 按分数降序排序
  scores.sort((a, b) => b.score - a.score);

  // 分配排名（处理并列）
  let currentRank = 1;
  scores.forEach((item, index) => {
    if (index > 0 && item.score < scores[index - 1].score) {
      currentRank = index + 1;
    }
    item.rank = currentRank;
  });

  return scores;
}
```

#### 展示组件:
```typescript
// ScoreBoard.tsx
function ScoreBoard() {
  const { activeChart } = useRadarStore();
  const rankings = useMemo(
    () => getRankings(activeChart.dimensions, activeChart.vendors),
    [activeChart.dimensions, activeChart.vendors]
  );

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">{t('scoreBoard.title')}</h3>
      <div className="space-y-2">
        {rankings.map(({ vendor, score, rank }) => (
          <div
            key={vendor.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <Badge variant={rank === 1 ? 'default' : 'secondary'}>#{rank}</Badge>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: vendor.color }} />
              <span className="font-medium">{vendor.name}</span>
            </div>
            <span className="text-xl font-bold">{score.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
```

### 3.7 数据验证与错误处理

#### Zod Schema 扩展:
```typescript
// lib/validators.ts
import { z } from 'zod';

// 权重验证
export const WeightSchema = z.number()
  .min(0, '权重不能为负数')
  .max(100, '权重不能超过 100%');

// 维度数组权重总和验证
export const DimensionsWeightSchema = z.array(z.any())
  .refine(
    (dimensions) => {
      const total = dimensions.reduce((sum, d) => sum + d.weight, 0);
      return total === 100;
    },
    { message: '所有维度权重总和必须为 100%' }
  );

// 分数验证
export const ScoreSchema = z.number()
  .int('分数必须为整数')
  .min(0, '分数不能小于 0')
  .max(10, '分数不能大于 10');
```

#### 验证 Hook:
```typescript
// hooks/useWeightValidation.ts
function useWeightValidation(dimensions: Dimension[]) {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    const newErrors: ValidationError[] = [];

    // 验证总权重
    const totalWeight = dimensions.reduce((sum, d) => sum + d.weight, 0);
    if (totalWeight !== 100) {
      newErrors.push({
        type: 'total_weight',
        message: `维度权重总和为 ${totalWeight}%，必须为 100%`,
        severity: 'error'
      });
    }

    // 验证子维度权重
    dimensions.forEach(dimension => {
      if (dimension.subDimensions?.length) {
        const subTotal = dimension.subDimensions.reduce((sum, sub) => sum + sub.weight, 0);
        if (subTotal !== 100) {
          newErrors.push({
            type: 'sub_weight',
            dimensionId: dimension.id,
            message: `"${dimension.name}" 的子维度权重总和为 ${subTotal}%，必须为 100%`,
            severity: 'error'
          });
        }
      }
    });

    setErrors(newErrors);
  }, [dimensions]);

  return { errors, isValid: errors.length === 0 };
}
```

## 4. 其他技术考虑

### 性能优化

#### 1. 虚拟化表格（可选）
- 如果维度数量 > 50，考虑使用 `@tanstack/react-virtual`
- 当前版本假设维度数量 < 20，不实现虚拟化

#### 2. 计算缓存
```typescript
// 使用 useMemo 缓存计算结果
const totalScores = useMemo(
  () => vendors.map(v => calculateTotalScore(dimensions, v.id)),
  [dimensions, vendors]
);
```

#### 3. 防抖输入
```typescript
// 分数输入时防抖更新
const debouncedUpdate = useDebouncedCallback(
  (dimensionId: string, vendorId: string, score: number) => {
    updateScore(dimensionId, vendorId, score);
  },
  300
);
```

### 用户体验优化

#### 1. 加载状态
- 数据保存到 IndexedDB 时显示 Loading
- 拖拽过程中显示拖拽指示器

#### 2. 撤销/重做（可选，v1.0+）
- 预留 Zustand 中间件支持撤销操作
- 使用 `zustand/middleware/temporal`

#### 3. 键盘快捷键
- Tab: 在表格单元格间导航
- Enter: 确认编辑
- Esc: 取消编辑
- Ctrl/Cmd + Z: 撤销（如实现）

### 无障碍性 (A11y)

#### ARIA 标签
```tsx
<button
  aria-label={t('dimension.add')}
  aria-describedby="add-dimension-description"
>
  <Plus className="w-4 h-4" />
</button>
```

#### 键盘导航
- 所有交互元素必须可通过键盘访问
- 拖拽操作提供键盘替代方案（上下箭头 + Space）

#### 屏幕阅读器
- 表格使用语义化 HTML (`<table>`, `<thead>`, `<tbody>`)
- 重要状态变化（权重验证失败）通过 ARIA live regions 通知

### 错误处理

#### 边界情况
1. **空数据状态**: 无维度/竞品时显示空状态插图和引导
2. **删除确认**: 删除雷达图/维度/竞品前弹出确认对话框
3. **数据冲突**: 同时编辑时的乐观更新和冲突解决

#### 错误恢复
```typescript
// 使用 React Error Boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dimension table error:', error, errorInfo);
    // 记录到错误追踪服务（可选）
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={this.reset} />;
    }
    return this.props.children;
  }
}
```

### 测试策略

#### 单元测试
- 计算函数：`calculateTotalScore`, `calculateParentScore`
- 验证函数：权重验证、分数验证
- 拖拽辅助函数

#### 集成测试
- 完整的编辑流程：添加维度 → 设置权重 → 输入分数 → 验证结果
- 拖拽排序流程
- 子维度自动计算

#### E2E 测试（可选）
- 使用 Playwright 测试关键用户路径

## 5. 待解决问题

### 产品问题:

1. **权重调整用户体验**
   - 问题: 手动调整多个维度权重使其总和为 100% 很困难
   - 方案 A: 提供"自动分配"按钮，平均分配剩余权重
   - 方案 B: 调整一个维度时，按比例自动调整其他维度
   - 方案 C: 提供滑块组件，联动调整
   - **决策**: 实现方案 A（最简单），方案 B 作为后续优化

2. **子维度展开默认状态**
   - 问题: 子维度默认展开还是收起？
   - **决策**: 默认收起，用户点击展开（减少视觉复杂度）

3. **删除操作确认**
   - 问题: 删除雷达图/维度/竞品时是否需要二次确认？
   - **决策**: 重要操作（删除雷达图、有子维度的维度）需要确认，其他操作支持撤销即可

4. **拖拽指示器样式**
   - 问题: 拖拽过程中的视觉反馈是什么？
   - **决策**: 使用半透明复制元素 + 目标位置蓝色虚线

### 技术问题:

1. **大数据量性能**
   - 问题: 如果维度 > 20 个，表格渲染可能卡顿
   - 缓解: 当前版本不优化，标注在文档中
   - 后续: v0.7.0 引入虚拟化

2. **IndexedDB 存储大小**
   - 问题: 多雷达图 + 子维度，数据量增长
   - 缓解: 监控存储使用量，必要时压缩数据
   - 限制: 单个 IndexedDB 数据库限制约 50MB（因浏览器而异）

3. **拖拽在移动端的表现**
   - 问题: dnd-kit 在移动端触摸事件支持如何？
   - 缓解: 移动端禁用拖拽，仅支持查看（符合 PRD）

4. **子维度雷达图与主图的同步**
   - 问题: 子维度图展开时，主图数据变化是否需要实时更新？
   - **决策**: 实时同步，因为数据源相同（Zustand Store）

### 依赖关系:

- ✅ 无阻塞依赖
- ⚠️ 设计稿（颜色方案、拖拽指示器样式）- 可使用默认样式先实现
- ⚠️ 国际化文案 - 先用英文占位，后续补充中文

### 风险项:

1. **学习曲线**: dnd-kit 库较复杂，需要时间熟悉
   - 缓解: 先实现简单拖拽（Tab、Vendor），再实现复杂嵌套拖拽（Dimension）

2. **权重验证的用户心智负担**
   - 风险: 用户可能不理解为什么权重必须为 100%
   - 缓解: 提供清晰的错误提示和帮助文档链接

3. **自动计算的透明度**
   - 风险: 用户可能不理解父维度分数是如何自动计算的
   - 缓解: 在 UI 中显示"自动计算"标识，并提供 Tooltip 说明

## 6. 实施顺序建议

基于依赖关系和优先级，建议按以下顺序实施：

### Phase 1: 基础管理功能（高优先级）
1. V04-1: 雷达图 Tab 导航（不含拖拽）
2. V04-3: 竞品系列管理（不含拖拽）
3. V04-4: 维度管理表格（不含子维度和拖拽）
4. V04-10: 总分计算和排名

**里程碑**: 基础 CRUD 完成，可管理多雷达图和维度

### Phase 2: 权重与自动计算（高优先级）
5. V04-5: 权重验证
6. V04-6: 子维度编辑器（不含拖拽）
7. V04-7: 子维度自动计算

**里程碑**: 完整的数据验证和计算逻辑

### Phase 3: 高级交互（中优先级）
8. V04-2: Tab 拖拽排序
9. V04-9: 维度拖拽排序
10. V04-8: 子维度雷达图

**里程碑**: 完整的用户体验和交互能力

---

**预计工作量**:
- Phase 1: 3-4 个工作日
- Phase 2: 2-3 个工作日
- Phase 3: 2-3 个工作日
- 测试与调试: 1-2 个工作日

**总计**: 8-12 个工作日
