/**
 * Zustand Store 类型定义
 */

import type {
  RadarChart,
  CreateRadarChartInput,
  UpdateRadarChartInput,
  CreateVendorInput,
  UpdateVendorInput,
  CreateDimensionInput,
  UpdateDimensionInput,
  CreateSubDimensionInput,
  UpdateSubDimensionInput,
  AppState,
} from '@/types'

/**
 * RadarChart 相关 Actions
 */
export interface RadarChartActions {
  /** 添加新雷达图 */
  addRadarChart: (input: CreateRadarChartInput) => string
  /** 更新雷达图 */
  updateRadarChart: (id: string, updates: UpdateRadarChartInput) => void
  /** 删除雷达图 */
  deleteRadarChart: (id: string) => void
  /** 设置当前激活的雷达图 */
  setActiveChart: (id: string | null) => void
  /** 获取当前激活的雷达图 */
  getActiveChart: () => RadarChart | null
}

/**
 * Vendor 相关 Actions
 */
export interface VendorActions {
  /** 添加竞品 */
  addVendor: (chartId: string, input: CreateVendorInput) => string
  /** 更新竞品 */
  updateVendor: (
    chartId: string,
    vendorId: string,
    updates: UpdateVendorInput
  ) => void
  /** 删除竞品 */
  deleteVendor: (chartId: string, vendorId: string) => void
  /** 重新排序竞品 */
  reorderVendors: (chartId: string, vendorIds: string[]) => void
}

/**
 * Dimension 相关 Actions
 */
export interface DimensionActions {
  /** 添加维度 */
  addDimension: (chartId: string, input: CreateDimensionInput) => string
  /** 更新维度 */
  updateDimension: (
    chartId: string,
    dimensionId: string,
    updates: UpdateDimensionInput
  ) => void
  /** 删除维度 */
  deleteDimension: (chartId: string, dimensionId: string) => void
  /** 重新排序维度 */
  reorderDimensions: (chartId: string, dimensionIds: string[]) => void
  /** 更新维度分数 */
  updateDimensionScore: (
    chartId: string,
    dimensionId: string,
    vendorId: string,
    score: number
  ) => void
}

/**
 * SubDimension 相关 Actions
 */
export interface SubDimensionActions {
  /** 添加子维度 */
  addSubDimension: (
    chartId: string,
    dimensionId: string,
    input: CreateSubDimensionInput
  ) => string
  /** 更新子维度 */
  updateSubDimension: (
    chartId: string,
    dimensionId: string,
    subDimensionId: string,
    updates: UpdateSubDimensionInput
  ) => void
  /** 删除子维度 */
  deleteSubDimension: (
    chartId: string,
    dimensionId: string,
    subDimensionId: string
  ) => void
  /** 重新排序子维度 */
  reorderSubDimensions: (
    chartId: string,
    dimensionId: string,
    subDimensionIds: string[]
  ) => void
  /** 更新子维度分数 */
  updateSubDimensionScore: (
    chartId: string,
    dimensionId: string,
    subDimensionId: string,
    vendorId: string,
    score: number
  ) => void
}

/**
 * 存储相关 Actions
 */
export interface StorageActions {
  /** 从存储加载数据 */
  loadFromStorage: () => Promise<void>
  /** 保存数据到存储 */
  saveToStorage: () => Promise<void>
  /** 设置加载状态 */
  setLoading: (isLoading: boolean) => void
  /** 更新最后保存时间 */
  updateLastSaved: () => void
}

/**
 * 完整的 Store 接口
 */
export interface RadarStore
  extends
    AppState,
    RadarChartActions,
    VendorActions,
    DimensionActions,
    SubDimensionActions,
    StorageActions {}
