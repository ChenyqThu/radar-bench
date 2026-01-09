import React, { useMemo, useRef, useEffect } from 'react'
import ReactECharts from 'echarts-for-react'
import { useTheme } from 'next-themes'
import { generateSubRadarChartOption, validateSubRadarData } from './utils'
import { cn } from '@/lib/utils'
import type { Dimension, Vendor } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

/**
 * 内联子维度雷达图组件的 Props
 */
export interface InlineSubRadarChartProps {
  /** 父维度 */
  dimension: Dimension
  /** 竞品列表 */
  vendors: Vendor[]
  /** 图表高度 */
  height?: string | number
  /** 图表宽度 */
  width?: string | number
  /** 加载状态 */
  loading?: boolean
  /** 关闭回调 */
  onClose?: () => void
}

/**
 * 内联子维度雷达图组件
 * 显示某个维度的子维度对比，不使用 Sheet
 */
export const InlineSubRadarChart: React.FC<InlineSubRadarChartProps> = ({
  dimension,
  vendors,
  height = 600,
  width = '100%',
  loading = false,
  onClose,
}) => {
  const chartRef = useRef<ReactECharts | null>(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // 生成子维度雷达图配置
  const chartOption = useMemo(() => {
    if (!validateSubRadarData(dimension)) return null
    return generateSubRadarChartOption(dimension, vendors, isDark)
  }, [dimension, vendors, isDark])

  // 监听窗口大小变化，自动调整图表
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        const instance = chartRef.current.getEchartsInstance()
        if (instance) {
          instance.resize()
        }
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 如果没有子维度，显示提示
  if (!dimension.subDimensions || dimension.subDimensions.length === 0) {
    return (
      <Card className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">{dimension.name} - 子维度</h3>
          {onClose && (
            <Button size="icon" variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div
          className={cn(
            'flex flex-1 items-center justify-center',
            'text-muted-foreground'
          )}
        >
          <div className="text-center">
            <p className="text-lg font-medium">暂无子维度数据</p>
            <p className="mt-2 text-sm">该维度尚未添加子维度</p>
          </div>
        </div>
      </Card>
    )
  }

  // 如果数据无效，显示错误提示
  if (!chartOption) {
    return (
      <Card className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">{dimension.name} - 子维度</h3>
          {onClose && (
            <Button size="icon" variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div
          className={cn(
            'flex flex-1 items-center justify-center',
            'text-destructive'
          )}
        >
          <div className="text-center">
            <p className="text-lg font-medium">数据格式错误</p>
            <p className="mt-2 text-sm">
              请确保至少有一个子维度和一个竞品，并且有有效的分数数据
            </p>
          </div>
        </div>
      </Card>
    )
  }

  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <Card className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">{dimension.name} - 子维度</h3>
          {onClose && (
            <Button size="icon" variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
            <p className="text-sm text-muted-foreground">加载中...</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="flex h-full flex-col">
      {/* 标题栏 */}
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="text-lg font-semibold">
          {dimension.name} - 子维度雷达图
        </h3>
        {onClose && (
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* 图表内容 */}
      <div className="flex-1 p-4">
        <ReactECharts
          ref={(e) => {
            chartRef.current = e
          }}
          option={chartOption}
          style={{ height, width }}
          notMerge={true}
          lazyUpdate={true}
          opts={{
            renderer: 'canvas',
            locale: 'ZH',
          }}
        />
      </div>

      {/* 子维度说明 */}
      <div className="border-t p-4">
        <h4 className="mb-3 text-sm font-semibold">子维度列表</h4>
        <div className="grid grid-cols-2 gap-2">
          {[...dimension.subDimensions]
            .sort((a, b) => a.order - b.order)
            .map((subDim) => (
              <div
                key={subDim.id}
                className="flex items-center justify-between rounded-md border bg-muted/50 p-2 text-sm"
              >
                <span className="font-medium">{subDim.name}</span>
                <span className="text-muted-foreground">
                  权重: {subDim.weight}%
                </span>
              </div>
            ))}
        </div>
      </div>
    </Card>
  )
}

// 使用 React.memo 优化性能
export default React.memo(InlineSubRadarChart)
