/**
 * 自动计算自定义 Hook
 * 监听子维度变化并自动更新父维度分数
 */

import { useEffect } from 'react'
import type { Dimension, Vendor } from '@/types'
import { calculateParentScore } from '@/lib/calculations'

/**
 * 自动计算 Hook
 * 当维度有子维度时，自动根据子维度的权重和分数计算父维度分数
 *
 * @param dimension 维度对象
 * @param vendors 竞品列表
 * @param onUpdate 更新回调函数
 */
export function useAutoCalculate(
  dimension: Dimension,
  vendors: Vendor[],
  onUpdate: (dimensionId: string, updates: Partial<Dimension>) => void
) {
  useEffect(() => {
    // 只有当维度有子维度时才自动计算
    if (!dimension.subDimensions || dimension.subDimensions.length === 0) {
      return
    }

    // 为每个竞品计算父维度分数
    const newScores: Record<string, number> = {}
    vendors.forEach((vendor) => {
      newScores[vendor.id] = calculateParentScore(
        dimension.subDimensions!,
        vendor.id
      )
    })

    // 检查分数是否变化
    const hasChanged = vendors.some(
      (vendor) => newScores[vendor.id] !== dimension.scores[vendor.id]
    )

    // 只在分数变化时更新
    if (hasChanged) {
      onUpdate(dimension.id, { scores: newScores })
    }
  }, [dimension, vendors, onUpdate])
}

/**
 * 批量自动计算 Hook
 * 为所有有子维度的维度自动计算分数
 *
 * @param dimensions 维度列表
 * @param vendors 竞品列表
 * @param onBatchUpdate 批量更新回调函数
 */
export function useBatchAutoCalculate(
  dimensions: Dimension[],
  vendors: Vendor[],
  onBatchUpdate: (
    updates: Array<{ dimensionId: string; scores: Record<string, number> }>
  ) => void
) {
  useEffect(() => {
    const updates: Array<{
      dimensionId: string
      scores: Record<string, number>
    }> = []

    dimensions.forEach((dimension) => {
      // 只处理有子维度的维度
      if (!dimension.subDimensions || dimension.subDimensions.length === 0) {
        return
      }

      // 为每个竞品计算父维度分数
      const newScores: Record<string, number> = {}
      vendors.forEach((vendor) => {
        newScores[vendor.id] = calculateParentScore(
          dimension.subDimensions!,
          vendor.id
        )
      })

      // 检查分数是否变化
      const hasChanged = vendors.some(
        (vendor) => newScores[vendor.id] !== dimension.scores[vendor.id]
      )

      if (hasChanged) {
        updates.push({ dimensionId: dimension.id, scores: newScores })
      }
    })

    // 批量更新
    if (updates.length > 0) {
      onBatchUpdate(updates)
    }
  }, [dimensions, vendors, onBatchUpdate])
}
