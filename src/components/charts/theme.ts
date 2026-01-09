import type { ChartTheme } from './types'

/**
 * 获取浅色主题配置
 */
export const getLightTheme = (): ChartTheme => ({
  backgroundColor: '#ffffff',
  textStyle: {
    color: '#1e293b',
    fontSize: 12,
  },
  legend: {
    textStyle: {
      color: '#1e293b',
    },
  },
  radar: {
    axisName: {
      color: '#475569',
    },
    splitLine: {
      lineStyle: {
        color: '#cbd5e1',
      },
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(241, 245, 249, 0.3)', 'rgba(248, 250, 252, 0.3)'],
      },
    },
  },
})

/**
 * 获取深色主题配置
 */
export const getDarkTheme = (): ChartTheme => ({
  backgroundColor: '#0f172a',
  textStyle: {
    color: '#e2e8f0',
    fontSize: 12,
  },
  legend: {
    textStyle: {
      color: '#e2e8f0',
    },
  },
  radar: {
    axisName: {
      color: '#94a3b8',
    },
    splitLine: {
      lineStyle: {
        color: '#334155',
      },
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(30, 41, 59, 0.3)', 'rgba(15, 23, 42, 0.3)'],
      },
    },
  },
})

/**
 * 根据主题模式获取对应的主题配置
 */
export const getChartTheme = (isDark: boolean): ChartTheme => {
  return isDark ? getDarkTheme() : getLightTheme()
}
