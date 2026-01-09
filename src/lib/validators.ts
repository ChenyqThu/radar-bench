/**
 * 数据验证工具函数
 */

import type { Dimension, SubDimension } from '@/types'

/**
 * 验证错误类型
 */
export interface ValidationError {
  /** 错误类型 */
  type: 'total_weight' | 'sub_weight' | 'score_range' | 'missing_data'
  /** 错误消息 */
  message: string
  /** 严重程度 */
  severity: 'error' | 'warning'
  /** 关联的维度 ID（如果适用） */
  dimensionId?: string
  /** 关联的子维度 ID（如果适用） */
  subDimensionId?: string
}

/**
 * 验证单个权重值是否有效
 * @param weight 权重值
 * @returns 是否有效
 */
export function isWeightValid(weight: number): boolean {
  return weight >= 0 && weight <= 100 && Number.isFinite(weight)
}

/**
 * 验证分数值是否有效
 * @param score 分数值
 * @returns 是否有效
 */
export function isScoreValid(score: number): boolean {
  return (
    Number.isInteger(score) &&
    score >= 0 &&
    score <= 10 &&
    Number.isFinite(score)
  )
}

/**
 * 验证维度权重总和是否为 100%
 * @param dimensions 维度列表
 * @returns { isValid: 是否有效, total: 实际总和, error: 错误信息 }
 */
export function validateDimensionsWeight(dimensions: Dimension[]): {
  isValid: boolean
  total: number
  error: ValidationError | null
} {
  if (!dimensions || dimensions.length === 0) {
    return {
      isValid: false,
      total: 0,
      error: {
        type: 'missing_data',
        message: 'No dimensions found',
        severity: 'error',
      },
    }
  }

  const total = dimensions.reduce((sum, d) => sum + (d.weight || 0), 0)
  const isValid = Math.abs(total - 100) < 0.01 // 允许浮点误差

  return {
    isValid,
    total,
    error: isValid
      ? null
      : {
          type: 'total_weight',
          message: `Dimension weights sum to ${total.toFixed(1)}%, must be 100%`,
          severity: 'error',
        },
  }
}

/**
 * 验证子维度权重总和是否为 100%
 * @param subDimensions 子维度列表
 * @param dimensionId 父维度 ID
 * @param dimensionName 父维度名称
 * @returns { isValid: 是否有效, total: 实际总和, error: 错误信息 }
 */
export function validateSubDimensionsWeight(
  subDimensions: SubDimension[],
  dimensionId: string,
  dimensionName: string
): {
  isValid: boolean
  total: number
  error: ValidationError | null
} {
  if (!subDimensions || subDimensions.length === 0) {
    // 没有子维度是合法的
    return {
      isValid: true,
      total: 0,
      error: null,
    }
  }

  const total = subDimensions.reduce((sum, sub) => sum + (sub.weight || 0), 0)
  const isValid = Math.abs(total - 100) < 0.01 // 允许浮点误差

  return {
    isValid,
    total,
    error: isValid
      ? null
      : {
          type: 'sub_weight',
          dimensionId,
          message: `Sub-dimensions of "${dimensionName}" sum to ${total.toFixed(1)}%, must be 100%`,
          severity: 'error',
        },
  }
}

/**
 * 验证所有维度和子维度权重
 * @param dimensions 维度列表
 * @returns 验证结果数组
 */
export function validateAllWeights(dimensions: Dimension[]): ValidationError[] {
  const errors: ValidationError[] = []

  // 验证一级维度权重总和
  const dimensionValidation = validateDimensionsWeight(dimensions)
  if (dimensionValidation.error) {
    errors.push(dimensionValidation.error)
  }

  // 验证每个维度的子维度权重总和
  dimensions.forEach((dimension) => {
    if (dimension.subDimensions && dimension.subDimensions.length > 0) {
      const subValidation = validateSubDimensionsWeight(
        dimension.subDimensions,
        dimension.id,
        dimension.name
      )
      if (subValidation.error) {
        errors.push(subValidation.error)
      }
    }
  })

  return errors
}

/**
 * 验证分数值是否在有效范围内
 * @param scores 分数记录对象
 * @returns 验证结果数组
 */
export function validateScores(
  scores: Record<string, number>
): ValidationError[] {
  const errors: ValidationError[] = []

  Object.entries(scores).forEach(([vendorId, score]) => {
    if (!isScoreValid(score)) {
      errors.push({
        type: 'score_range',
        message: `Invalid score ${score} for vendor ${vendorId}. Score must be an integer between 0 and 10.`,
        severity: 'error',
      })
    }
  })

  return errors
}

/**
 * 自动规范化权重，使其总和为 100%
 * @param weights 权重数组
 * @returns 规范化后的权重数组
 */
export function normalizeWeights(weights: number[]): number[] {
  if (weights.length === 0) return []

  const total = weights.reduce((sum, w) => sum + w, 0)
  if (total === 0) {
    // 如果总和为 0，平均分配
    const avg = 100 / weights.length
    return weights.map(() => avg)
  }

  // 按比例调整，使总和为 100
  return weights.map((w) => Math.round((w / total) * 100 * 10) / 10)
}

/**
 * 平均分配权重
 * @param count 项目数量
 * @returns 平均分配的权重数组
 */
export function distributeWeightsEvenly(count: number): number[] {
  if (count === 0) return []
  if (count === 1) return [100]

  const base = Math.floor(100 / count)
  const remainder = 100 - base * count

  // 前 remainder 个项目分配 base + 1，其余分配 base
  return Array.from({ length: count }, (_, i) =>
    i < remainder ? base + 1 : base
  )
}
