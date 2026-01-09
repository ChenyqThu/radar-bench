import React, { useMemo, useRef, useEffect } from 'react'
import ReactECharts from 'echarts-for-react'
import { useTheme } from 'next-themes'
import { useRadarStore } from '@/store/radarStore'
import { generateSubRadarChartOption, validateSubRadarData } from './utils'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

/**
 * 子维度雷达图组件的 Props
 */
export interface SubRadarChartProps {
  /** 是否显示 Sheet */
  open: boolean
  /** 关闭 Sheet 的回调 */
  onOpenChange: (open: boolean) => void
  /** 父维度 ID */
  dimensionId: string
  /** 父维度名称 */
  dimensionName: string
  /** 图表高度 */
  height?: string | number
  /** 图表宽度 */
  width?: string | number
  /** 加载状态 */
  loading?: boolean
}

/**
 * 子维度雷达图组件
 * 使用 Sheet 侧边展开显示某个维度的子维度对比
 */
export const SubRadarChart: React.FC<SubRadarChartProps> = ({
  open,
  onOpenChange,
  dimensionId,
  dimensionName,
  height = 500,
  width = '100%',
  loading = false,
}) => {
  const chartRef = useRef<ReactECharts | null>(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // 从 Store 获取活动的雷达图和对应的维度
  const { getActiveChart } = useRadarStore()
  const activeChart = getActiveChart()

  // 查找对应的维度
  const dimension = useMemo(() => {
    if (!activeChart) return null
    return activeChart.dimensions.find((d) => d.id === dimensionId)
  }, [activeChart, dimensionId])

  // 生成子维度雷达图配置
  const chartOption = useMemo(() => {
    if (!activeChart || !dimension) return null
    if (!validateSubRadarData(dimension)) return null

    return generateSubRadarChartOption(dimension, activeChart.vendors, isDark)
  }, [activeChart, dimension, isDark])

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

  // 渲染图表内容
  const renderChartContent = () => {
    // 如果没有维度或子维度，显示提示
    if (
      !dimension ||
      !dimension.subDimensions ||
      dimension.subDimensions.length === 0
    ) {
      return (
        <div
          className={cn(
            'flex items-center justify-center rounded-lg border-2 border-dashed',
            'border-gray-300 dark:border-gray-700',
            'bg-gray-50 dark:bg-gray-900/50'
          )}
          style={{ height, width }}
        >
          <div className="text-center">
            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
              暂无子维度数据
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
              该维度尚未添加子维度
            </p>
          </div>
        </div>
      )
    }

    // 如果数据无效，显示错误提示
    if (!chartOption) {
      return (
        <div
          className={cn(
            'flex items-center justify-center rounded-lg border-2 border-dashed',
            'border-red-300 dark:border-red-700',
            'bg-red-50 dark:bg-red-900/20'
          )}
          style={{ height, width }}
        >
          <div className="text-center">
            <p className="text-lg font-medium text-red-600 dark:text-red-400">
              数据格式错误
            </p>
            <p className="mt-2 text-sm text-red-500 dark:text-red-500">
              请确保至少有一个子维度和一个竞品，并且有有效的分数数据
            </p>
          </div>
        </div>
      )
    }

    // 如果正在加载，显示加载状态
    if (loading) {
      return (
        <div
          className={cn(
            'flex items-center justify-center rounded-lg',
            'bg-gray-50 dark:bg-gray-900/50'
          )}
          style={{ height, width }}
        >
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              加载中...
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="sub-radar-chart-container">
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
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[600px] sm:w-[700px] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-xl">
            {dimensionName} - 子维度雷达图
          </SheetTitle>
          <SheetDescription>
            查看该维度下各子维度在不同竞品中的表现对比
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">{renderChartContent()}</div>

        {dimension &&
          dimension.subDimensions &&
          dimension.subDimensions.length > 0 && (
            <div className="mt-6">
              <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                子维度说明
              </h4>
              <div className="space-y-2">
                {[...dimension.subDimensions]
                  .sort((a, b) => a.order - b.order)
                  .map((subDim) => (
                    <div
                      key={subDim.id}
                      className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {subDim.name}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            权重: {subDim.weight}%
                          </span>
                        </div>
                        {subDim.description && (
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {subDim.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
      </SheetContent>
    </Sheet>
  )
}

// 使用 React.memo 优化性能
export default React.memo(SubRadarChart)
