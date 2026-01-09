/**
 * 雷达图和应用状态相关类型定义
 */

import type { Vendor } from './vendor'
import type { Dimension } from './dimension'

/**
 * 雷达图（RadarChart）
 * 代表一个完整的雷达图对比场景
 */
export interface RadarChart {
  /** 唯一标识 */
  id: string
  /** 雷达图名称 */
  name: string
  /** 排序序号 */
  order: number
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
  /** 竞品系列列表 */
  vendors: Vendor[]
  /** 一级维度列表 */
  dimensions: Dimension[]
}

/**
 * 创建 RadarChart 时的输入类型
 */
export type CreateRadarChartInput = {
  name: string
  vendors?: Vendor[]
  dimensions?: Dimension[]
}

/**
 * 更新 RadarChart 时的输入类型
 */
export type UpdateRadarChartInput = Partial<{
  name: string
  order: number
  vendors: Vendor[]
  dimensions: Dimension[]
}>

/**
 * 应用状态（AppState）
 * 全局应用状态管理
 */
export interface AppState {
  /** 所有雷达图 */
  radarCharts: RadarChart[]
  /** 当前激活的雷达图 ID */
  activeChartId: string | null
  /** 加载状态 */
  isLoading: boolean
  /** 最后保存时间 */
  lastSaved: Date | null
}
