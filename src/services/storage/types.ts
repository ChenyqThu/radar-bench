/**
 * 存储服务类型定义
 */

import type { RadarChart } from '@/types'

/**
 * 应用设置存储项
 */
export interface AppSetting {
  key: string
  value: unknown
}

/**
 * 存储服务接口
 */
export interface StorageService {
  /** 保存雷达图 */
  saveRadarChart: (chart: RadarChart) => Promise<void>
  /** 获取单个雷达图 */
  getRadarChart: (id: string) => Promise<RadarChart | undefined>
  /** 获取所有雷达图 */
  getAllRadarCharts: () => Promise<RadarChart[]>
  /** 删除雷达图 */
  deleteRadarChart: (id: string) => Promise<void>
  /** 清空所有雷达图 */
  clearAllRadarCharts: () => Promise<void>

  /** 保存应用设置 */
  saveAppSettings: (key: string, value: unknown) => Promise<void>
  /** 获取应用设置 */
  getAppSettings: (key: string) => Promise<unknown>
  /** 删除应用设置 */
  deleteAppSettings: (key: string) => Promise<void>
}
