import type { EChartsOption } from 'echarts'

/**
 * 雷达图配置选项
 */
export interface RadarChartOption extends EChartsOption {
  radar?: {
    indicator?: Array<{
      name: string
      max: number
      min?: number
    }>
    shape?: 'polygon' | 'circle'
    splitNumber?: number
    axisName?: {
      color?: string
      fontSize?: number
    }
  }
}

/**
 * 雷达图系列数据
 */
export interface RadarSeriesData {
  name: string
  value: number[]
  itemStyle?: {
    color?: string
  }
  lineStyle?: {
    width?: number
    type?: 'solid' | 'dashed' | 'dotted'
  }
  areaStyle?: {
    opacity?: number
  }
  symbol?: 'circle' | 'rect' | 'triangle' | 'diamond'
  symbolSize?: number
}

/**
 * ECharts 主题配置
 */
export interface ChartTheme {
  backgroundColor: string
  textStyle: {
    color: string
    fontSize?: number
  }
  legend?: {
    textStyle?: {
      color: string
    }
  }
  radar?: {
    axisName?: {
      color: string
    }
    splitLine?: {
      lineStyle: {
        color: string
      }
    }
    splitArea?: {
      areaStyle: {
        color: string[]
      }
    }
  }
}

/**
 * 雷达图组件 Props
 */
export interface RadarChartProps {
  className?: string
  height?: string | number
  width?: string | number
  loading?: boolean
  onDimensionClick?: (dimensionId: string, dimensionName: string) => void
}
