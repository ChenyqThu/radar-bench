import type { RadarChart, Vendor, Dimension } from '@/types'
import type { RadarChartOption, RadarSeriesData } from './types'
import { getChartTheme } from './theme'

/**
 * 生成雷达图的指示器配置
 */
export const generateRadarIndicators = (dimensions: Dimension[]) => {
  return [...dimensions]
    .sort((a, b) => a.order - b.order)
    .map((dimension) => ({
      name: dimension.name,
      max: 10, // 分数范围 0-10
      min: 0,
    }))
}

/**
 * 生成雷达图系列数据
 */
export const generateRadarSeriesData = (
  vendors: Vendor[],
  dimensions: Dimension[]
): RadarSeriesData[] => {
  // 按 order 排序维度
  const sortedDimensions = [...dimensions].sort((a, b) => a.order - b.order)

  // 按 order 排序 vendors
  const sortedVendors = [...vendors].sort((a, b) => a.order - b.order)

  return sortedVendors.map((vendor) => ({
    name: vendor.name,
    value: sortedDimensions.map((dimension) => {
      const score = dimension.scores[vendor.id]
      return typeof score === 'number' ? score : 0
    }),
    itemStyle: {
      color: vendor.color,
    },
    lineStyle: {
      width: 2,
      type: 'solid',
    },
    areaStyle: {
      opacity: 0.1,
    },
    symbol: vendor.symbol,
    symbolSize: 8,
  }))
}

/**
 * 生成完整的雷达图配置选项
 */
export const generateRadarChartOption = (
  radarChart: RadarChart,
  isDark: boolean
): RadarChartOption => {
  const theme = getChartTheme(isDark)
  const indicators = generateRadarIndicators(radarChart.dimensions)
  const seriesData = generateRadarSeriesData(
    radarChart.vendors,
    radarChart.dimensions
  )

  const option: RadarChartOption = {
    backgroundColor: theme.backgroundColor,
    title: {
      text: radarChart.name,
      left: 'center',
      top: 10,
      textStyle: {
        color: theme.textStyle.color,
        fontSize: 18,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      show: true,
      trigger: 'item',
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderColor: isDark ? '#334155' : '#cbd5e1',
      borderWidth: 1,
      textStyle: {
        color: theme.textStyle.color,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (params: any) => {
        if (params.componentSubType === 'radar') {
          const vendorName = params.name
          let content = `<strong>${vendorName}</strong><br/>`

          params.value.forEach((score: number, index: number) => {
            const dimensionName = indicators[index]?.name || ''
            content += `${dimensionName}: ${score}<br/>`
          })

          return content
        }
        return ''
      },
    },
    legend: {
      show: true,
      data: radarChart.vendors.map((v) => v.name),
      bottom: 10,
      textStyle: theme.legend?.textStyle,
      itemWidth: 25,
      itemHeight: 14,
    },
    radar: {
      indicator: indicators,
      shape: 'polygon',
      splitNumber: 5,
      axisName: {
        color: theme.radar?.axisName?.color,
        fontSize: 13,
      },
      ...(theme.radar?.splitLine && { splitLine: theme.radar.splitLine }),
      ...(theme.radar?.splitArea && { splitArea: theme.radar.splitArea }),
      axisLine: {
        lineStyle: {
          color: theme.radar?.splitLine?.lineStyle.color,
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    series: [
      {
        type: 'radar',
        data: seriesData,
        emphasis: {
          lineStyle: {
            width: 3,
          },
          areaStyle: {
            opacity: 0.2,
          },
        },
      },
    ],
    // 动画配置
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicInOut',
    animationDelay: (idx: number) => idx * 50,
  }

  return option
}

/**
 * 验证雷达图数据是否有效
 */
export const validateRadarData = (radarChart: RadarChart): boolean => {
  // 检查是否有维度
  if (!radarChart.dimensions || radarChart.dimensions.length === 0) {
    return false
  }

  // 检查是否有竞品
  if (!radarChart.vendors || radarChart.vendors.length === 0) {
    return false
  }

  // 检查每个维度是否至少有一个有效分数
  const hasValidScores = radarChart.dimensions.some((dimension) => {
    return radarChart.vendors.some((vendor) => {
      const score = dimension.scores[vendor.id]
      return typeof score === 'number' && score >= 0 && score <= 10
    })
  })

  return hasValidScores
}
