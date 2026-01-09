/**
 * 维度相关类型定义
 */

/**
 * 分数记录
 * Key: Vendor ID
 * Value: 分数 (0-10)
 */
export type ScoreRecord = Record<string, number>

/**
 * 子维度（SubDimension）
 * 二级维度，用于更细粒度的评分
 */
export interface SubDimension {
  /** 唯一标识 */
  id: string
  /** 子维度名称 */
  name: string
  /** 子维度说明（可选） */
  description?: string
  /** 在父维度内的权重（0-100，总和应为 100%） */
  weight: number
  /** 排序序号 */
  order: number
  /** 每个 Vendor 的分数 { vendorId: score } */
  scores: ScoreRecord
}

/**
 * 一级维度（Dimension）
 * 雷达图的主要评估维度
 */
export interface Dimension {
  /** 唯一标识 */
  id: string
  /** 维度名称 */
  name: string
  /** 维度说明（评分标准等，可选） */
  description?: string
  /** 权重（0-100，所有维度总和应为 100%） */
  weight: number
  /** 排序序号 */
  order: number
  /** 每个 Vendor 的分数 { vendorId: score } */
  scores: ScoreRecord
  /** 子维度列表（可选） */
  subDimensions?: SubDimension[]
}

/**
 * 创建 SubDimension 时的输入类型（不包含 id）
 */
export type CreateSubDimensionInput = Omit<SubDimension, 'id'>

/**
 * 更新 SubDimension 时的输入类型（所有字段可选）
 */
export type UpdateSubDimensionInput = Partial<Omit<SubDimension, 'id'>>

/**
 * 创建 Dimension 时的输入类型（不包含 id）
 */
export type CreateDimensionInput = Omit<Dimension, 'id'>

/**
 * 更新 Dimension 时的输入类型（所有字段可选）
 */
export type UpdateDimensionInput = Partial<Omit<Dimension, 'id'>>
