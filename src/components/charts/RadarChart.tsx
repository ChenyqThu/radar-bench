import React, { useMemo, useRef, useEffect } from 'react'
import ReactECharts from 'echarts-for-react'
import { useTheme } from 'next-themes'
import { useRadarStore } from '@/store/radarStore'
import { generateRadarChartOption, validateRadarData } from './utils'
import type { RadarChartProps } from './types'
import { cn } from '@/lib/utils'

/**
 * 主雷达图组件
 * 显示多个竞品在各维度上的能力对比
 */
export const RadarChart: React.FC<RadarChartProps> = ({
  className,
  height = 600,
  width = '100%',
  loading = false,
  onDimensionClick,
}) => {
  const chartRef = useRef<ReactECharts | null>(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // 从 Store 获取活动的雷达图
  const { getActiveChart } = useRadarStore()
  const activeChart = getActiveChart()

  // 生成雷达图配置
  const chartOption = useMemo(() => {
    if (!activeChart) return null
    if (!validateRadarData(activeChart)) return null

    return generateRadarChartOption(activeChart, isDark)
  }, [activeChart, isDark])

  // 处理图表点击事件
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChartClick = (params: any) => {
    if (params.componentType === 'radar' && onDimensionClick) {
      // 获取点击的维度索引
      const dataIndex = params.dataIndex
      if (
        activeChart &&
        dataIndex >= 0 &&
        dataIndex < activeChart.dimensions.length
      ) {
        const dimension = activeChart.dimensions[dataIndex]
        onDimensionClick(dimension.id, dimension.name)
      }
    }
  }

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

  // 如果没有活动的雷达图，显示提示
  if (!activeChart) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-lg border-2 border-dashed',
          'border-gray-300 dark:border-gray-700',
          'bg-gray-50 dark:bg-gray-900/50',
          className
        )}
        style={{ height, width }}
      >
        <div className="text-center">
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
            暂无雷达图数据
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            请先创建一个雷达图
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
          'bg-red-50 dark:bg-red-900/20',
          className
        )}
        style={{ height, width }}
      >
        <div className="text-center">
          <p className="text-lg font-medium text-red-600 dark:text-red-400">
            数据格式错误
          </p>
          <p className="mt-2 text-sm text-red-500 dark:text-red-500">
            请确保至少有一个维度和一个竞品，并且有有效的分数数据
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
          'bg-gray-50 dark:bg-gray-900/50',
          className
        )}
        style={{ height, width }}
      >
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
          <p className="text-sm text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('radar-chart-container', className)}>
      <ReactECharts
        ref={(e) => {
          chartRef.current = e
        }}
        option={chartOption}
        style={{ height, width }}
        notMerge={true}
        lazyUpdate={true}
        onEvents={{
          click: handleChartClick,
        }}
        opts={{
          renderer: 'canvas',
          locale: 'ZH',
        }}
      />
    </div>
  )
}

// 使用 React.memo 优化性能
export default React.memo(RadarChart)
