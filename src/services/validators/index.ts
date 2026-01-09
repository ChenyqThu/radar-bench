/**
 * 数据验证工具函数
 */

import type { Dimension, SubDimension } from '@/types'
import { WEIGHT_TOTAL } from '@/lib/constants'

/**
 * 验证错误类
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

/**
 * 验证维度权重总和是否为 100%
 * @param dimensions 维度列表
 * @throws {ValidationError} 如果权重总和不为 100%
 */
export function validateDimensionWeights(dimensions: Dimension[]): void {
  if (dimensions.length === 0) {
    return // 空列表不验证
  }

  const total = dimensions.reduce((sum, dim) => sum + dim.weight, 0)

  // 使用小数点精度比较（允许 0.01 的误差）
  if (Math.abs(total - WEIGHT_TOTAL) > 0.01) {
    throw new ValidationError(
      `维度权重总和必须为 ${WEIGHT_TOTAL}%，当前为 ${total.toFixed(2)}%`
    )
  }
}

/**
 * 验证子维度权重总和是否为 100%
 * @param subDimensions 子维度列表
 * @throws {ValidationError} 如果权重总和不为 100%
 */
export function validateSubDimensionWeights(
  subDimensions: SubDimension[]
): void {
  if (subDimensions.length === 0) {
    return // 空列表不验证
  }

  const total = subDimensions.reduce((sum, sub) => sum + sub.weight, 0)

  // 使用小数点精度比较（允许 0.01 的误差）
  if (Math.abs(total - WEIGHT_TOTAL) > 0.01) {
    throw new ValidationError(
      `子维度权重总和必须为 ${WEIGHT_TOTAL}%，当前为 ${total.toFixed(2)}%`
    )
  }
}

/**
 * 验证所有维度的子维度权重（如果存在子维度）
 * @param dimensions 维度列表
 * @throws {ValidationError} 如果任何维度的子维度权重总和不为 100%
 */
export function validateAllSubDimensionWeights(dimensions: Dimension[]): void {
  for (const dimension of dimensions) {
    if (dimension.subDimensions && dimension.subDimensions.length > 0) {
      try {
        validateSubDimensionWeights(dimension.subDimensions)
      } catch (error) {
        if (error instanceof ValidationError) {
          throw new ValidationError(`维度"${dimension.name}"的${error.message}`)
        }
        throw error
      }
    }
  }
}

/**
 * 验证分数记录中所有 Vendor ID 都存在
 * @param scores 分数记录
 * @param vendorIds 有效的 Vendor ID 列表
 * @throws {ValidationError} 如果存在无效的 Vendor ID
 */
export function validateScoreVendorIds(
  scores: Record<string, number>,
  vendorIds: string[]
): void {
  const scoreVendorIds = Object.keys(scores)
  const invalidIds = scoreVendorIds.filter((id) => !vendorIds.includes(id))

  if (invalidIds.length > 0) {
    throw new ValidationError(
      `分数记录中包含无效的 Vendor ID: ${invalidIds.join(', ')}`
    )
  }
}

/**
 * 验证维度 ID 唯一性
 * @param dimensions 维度列表
 * @throws {ValidationError} 如果存在重复的 ID
 */
export function validateUniqueDimensionIds(dimensions: Dimension[]): void {
  const ids = dimensions.map((d) => d.id)
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index)

  if (duplicates.length > 0) {
    throw new ValidationError(
      `维度 ID 必须唯一，发现重复: ${[...new Set(duplicates)].join(', ')}`
    )
  }
}

/**
 * 验证 Vendor ID 唯一性
 * @param vendorIds Vendor ID 列表
 * @throws {ValidationError} 如果存在重复的 ID
 */
export function validateUniqueVendorIds(vendorIds: string[]): void {
  const duplicates = vendorIds.filter(
    (id, index) => vendorIds.indexOf(id) !== index
  )

  if (duplicates.length > 0) {
    throw new ValidationError(
      `Vendor ID 必须唯一，发现重复: ${[...new Set(duplicates)].join(', ')}`
    )
  }
}
