# 版本设计文档: v0.3.0 - 雷达图可视化 MVP
雷达图可视化最小可用版本的技术实现和设计指南。

## 1. 功能概述
本版本交付雷达图可视化的最小可用产品,专注于使用 Apache ECharts 展示数据并提供基础交互能力。

### v0.3.0 包含的功能:

| ID | 功能 | 描述 |
|----|---------|-------------|
| V03-1 | ECharts 集成 | 集成 Apache ECharts 图表库 |
| V03-2 | 主雷达图组件 | 实现多系列雷达图渲染 |
| V03-3 | 图表交互功能 | 实现悬浮提示、点击事件、图例控制 |
| V03-4 | 图表动画效果 | 添加加载动画和过渡效果 |
| V03-5 | 基础数据编辑界面 | 创建简单的维度和分数编辑表单 |

### 核心交付物:
- 可展示多个竞品在主维度上的功能雷达图
- 支持悬浮效果和图例切换的交互式图表
- 用于输入/编辑维度名称和竞品分数的基础 UI
- 数据更新时的平滑动画效果

## 2. 技术架构概览

### 前端技术栈 (已建立):
- **框架**: React 18 + TypeScript + Vite
- **UI 组件**: Shadcn/ui + Tailwind CSS
- **状态管理**: Zustand (已在 v0.2.0 实现)
- **数据存储**: IndexedDB with Dexie.js (已在 v0.2.0 实现)
- **国际化**: react-i18next (已在 v0.1.0 配置)

### v0.3.0 新增依赖:
```json
{
  "echarts": "^5.5.0",
  "echarts-for-react": "^3.0.2"
}
```

### 组件架构:
```
src/
├── components/
│   ├── charts/
│   │   ├── RadarChart.tsx          # 主雷达图组件 (ECharts 封装)
│   │   ├── ChartToolbar.tsx        # 图表控制工具栏 (导出、全屏等)
│   │   └── types.ts                # 图表相关 TypeScript 类型
│   ├── editors/
│   │   ├── DimensionEditor.tsx     # 维度编辑简单表单
│   │   ├── VendorEditor.tsx        # 竞品编辑简单表单
│   │   └── ScoreEditor.tsx         # 分数编辑简单表单
│   └── ui/                         # 现有 Shadcn 组件
```

### 数据流:
```
用户输入 → 表单组件 → Zustand Store → IndexedDB (自动保存)
                                    ↓
                            RadarChart 组件
                                    ↓
                            ECharts 渲染
```

## 3. 实现要点

### ECharts 配置策略

#### 3.1 基础雷达图配置
雷达图将使用 ECharts 原生的 radar 系列类型,核心配置如下:

```typescript
const radarOption: EChartsOption = {
  title: {
    text: radarChart.name,
    left: 'center'
  },
  legend: {
    show: true,
    data: vendors.map(v => v.name),
    bottom: 0
  },
  radar: {
    indicator: dimensions.map(d => ({
      name: d.name,
      max: 10  // 分数范围 0-10
    }))
  },
  series: [{
    type: 'radar',
    data: vendors.map(vendor => ({
      name: vendor.name,
      value: dimensions.map(d => d.scores[vendor.id] || 0),
      itemStyle: { color: vendor.color },
      symbol: vendor.symbol,
      lineStyle: { width: 2 },
      areaStyle: { opacity: 0.1 }
    }))
  }]
};
```

#### 3.2 交互功能
- **悬浮提示**: 显示竞品名称、维度名称和分数值
- **图例切换**: 点击图例项显示/隐藏竞品系列
- **点击事件**: 为未来的子维度下钻功能预留接口 (v0.4.0)

#### 3.3 动画配置
```typescript
animation: true,
animationDuration: 1000,
animationEasing: 'cubicInOut',
animationDelay: (idx: number) => idx * 50  // 交错动画
```

### 响应式设计考虑
- 图表应随窗口动态调整大小
- 使用 `echarts-for-react` 处理 React 生命周期和响应式
- 最小图表尺寸: 400px × 400px
- 最佳尺寸: 600px × 600px

### 主题集成
- 图表必须适配浅色/深色主题
- 基于当前主题状态配置 ECharts 主题
- 色彩方案必须与 Tailwind CSS 设计令牌匹配

```typescript
const getEChartsTheme = (isDark: boolean) => ({
  backgroundColor: isDark ? '#1e293b' : '#ffffff',
  textStyle: {
    color: isDark ? '#e2e8f0' : '#1e293b'
  }
});
```

### 数据验证
- 确保所有分数在渲染前为 0-10 的整数
- 优雅处理缺失数据 (使用 0 作为默认值)
- 验证所有维度至少有一个竞品有分数

## 4. 其他技术考虑

### 性能优化
- **防抖更新**: 用户编辑分数时,防抖图表更新 (300ms) 以避免过度重渲染
- **记忆化**: 对图表组件使用 `React.memo()` 防止不必要的重渲染
- **懒加载**: 保持 ECharts 包独立以实现代码分割

### 错误处理
- 优雅处理 ECharts 初始化失败
- 如果图表无法渲染,显示降级 UI
- 将错误记录到控制台以便调试

### 无障碍性
- 为图表容器添加 ARIA 标签
- 为图表数据提供文本替代方案 (表格视图可在 v0.4.0 添加)
- 确保交互元素支持键盘导航

### 浏览器兼容性
- 目标现代浏览器 (Chrome, Safari, Edge, Firefox)
- ECharts 具有良好的兼容性,但需测试各浏览器的 SVG 渲染

### 与现有 Store 集成
雷达图将直接从现有 Zustand store 消费数据:

```typescript
// 来自现有 store (v0.2.0)
const {
  radarCharts,
  activeChartId,
  updateDimension,
  updateVendorScore
} = useRadarStore();

const activeChart = radarCharts.find(chart => chart.id === activeChartId);
```

### 自动保存集成
通过基础编辑界面进行的更改将触发 v0.2.0 中实现的现有自动保存机制。

## 5. 待解决问题

### 技术问题:
1. **子维度可视化策略** (v0.4.0+)
   - 问题: 子维度应使用独立雷达图还是集成到主图表中?
   - 影响: 将影响本版本中点击事件处理器的设计
   - 决策: 设计可扩展的点击事件处理器,为未来的下钻功能做准备

2. **图表导出格式优先级**
   - 问题: v0.5.0 中应优先支持哪种导出格式 (PNG vs SVG)?
   - 影响: 可能影响我们如何配置 ECharts 渲染器 (canvas vs SVG)
   - 当前方案: 使用 canvas 渲染器 (默认) 以获得更好性能

3. **移动端响应式**
   - 问题: 图表在小屏幕 (平板/手机) 上应如何适配?
   - 影响: 可能需要针对断点的特定配置
   - 当前方案: 桌面优先,移动端视图推迟到 v0.7.0

### 产品问题:
1. **首次启动的默认数据**
   - 问题: 是否应为首次使用的用户提供示例/演示数据?
   - 当前方案: 使用 `src/lib/mockData.ts` 中的现有模拟数据

2. **编辑用户体验**
   - 问题: 编辑应该是内联的还是在独立面板/模态框中?
   - 当前方案: 从简单的表单面板开始 (可在 v0.4.0 迭代)

3. **动画偏好**
   - 问题: 动画是否应该可配置 (某些用户可能更喜欢静态图表)?
   - 决策: 默认启用动画,设置推迟到后续版本

### 依赖关系:
- v0.3.0 开发无阻塞项
- 与设计团队协调最终确定色彩方案 (锦上添花)
