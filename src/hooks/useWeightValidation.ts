/**
 * 权重验证自定义 Hook
 * 实时验证维度权重总和
 */

import { useMemo } from 'react'
import type { Dimension } from '@/types'
import {
  validateDimensionsWeight,
  validateSubDimensionsWeight,
  type ValidationError,
} from '@/lib/validators'

/**
 * 权重验证结果
 */
export interface WeightValidationResult {
  /** 是否全部有效 */
  isValid: boolean
  /** 一级维度权重总和 */
  dimensionTotal: number
  /** 一级维度验证错误 */
  dimensionError: ValidationError | null
  /** 子维度验证错误数组 */
  subDimensionErrors: ValidationError[]
  /** 所有验证错误 */
  allErrors: ValidationError[]
}

/**
 * 权重验证 Hook
 * @param dimensions 维度列表
 * @returns 验证结果
 */
export function useWeightValidation(
  dimensions: Dimension[]
): WeightValidationResult {
  return useMemo(() => {
    // 验证一级维度权重总和
    const dimensionValidation = validateDimensionsWeight(dimensions)

    // 验证每个维度的子维度权重总和
    const subDimensionErrors: ValidationError[] = []
    dimensions.forEach((dimension) => {
      if (dimension.subDimensions && dimension.subDimensions.length > 0) {
        const subValidation = validateSubDimensionsWeight(
          dimension.subDimensions,
          dimension.id,
          dimension.name
        )
        if (subValidation.error) {
          subDimensionErrors.push(subValidation.error)
        }
      }
    })

    // 汇总所有错误
    const allErrors: ValidationError[] = []
    if (dimensionValidation.error) {
      allErrors.push(dimensionValidation.error)
    }
    allErrors.push(...subDimensionErrors)

    return {
      isValid: allErrors.length === 0,
      dimensionTotal: dimensionValidation.total,
      dimensionError: dimensionValidation.error,
      subDimensionErrors,
      allErrors,
    }
  }, [dimensions])
}
