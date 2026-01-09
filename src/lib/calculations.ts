/**
 * 分数计算工具函数
 */

import type { Dimension, SubDimension, Vendor } from '@/types'

/**
 * 根据子维度权重和分数，自动计算父维度分数
 * @param subDimensions 子维度列表
 * @param vendorId 竞品 ID
 * @returns 加权平均分数 (0-10)
 */
export function calculateParentScore(
  subDimensions: SubDimension[],
  vendorId: string
): number {
  if (!subDimensions || subDimensions.length === 0) return 0

  const totalWeight = subDimensions.reduce((sum, sub) => sum + sub.weight, 0)
  if (totalWeight === 0) return 0

  const weightedSum = subDimensions.reduce((sum, sub) => {
    const score = sub.scores[vendorId] || 0
    return sum + score * sub.weight
  }, 0)

  // 返回加权平均分，保留 1 位小数
  return Math.round((weightedSum / totalWeight) * 10) / 10
}

/**
 * 计算竞品的加权总分
 * @param dimensions 维度列表
 * @param vendorId 竞品 ID
 * @returns 加权总分 (0-10)
 */
export function calculateTotalScore(
  dimensions: Dimension[],
  vendorId: string
): number {
  if (!dimensions || dimensions.length === 0) return 0

  const totalWeight = dimensions.reduce((sum, d) => sum + d.weight, 0)
  if (totalWeight === 0) return 0

  const weightedSum = dimensions.reduce((sum, d) => {
    const score = d.scores[vendorId] || 0
    return sum + (score * d.weight) / 100
  }, 0)

  // 返回加权总分，保留 2 位小数
  return Math.round(weightedSum * 100) / 100
}

/**
 * 排名项
 */
export interface RankingItem {
  vendor: Vendor
  score: number
  rank: number
}

/**
 * 生成排名列表
 * @param dimensions 维度列表
 * @param vendors 竞品列表
 * @returns 排名列表（按分数降序）
 */
export function getRankings(
  dimensions: Dimension[],
  vendors: Vendor[]
): RankingItem[] {
  // 计算每个竞品的总分
  const scores = vendors.map((vendor) => ({
    vendor,
    score: calculateTotalScore(dimensions, vendor.id),
    rank: 0,
  }))

  // 按分数降序排序
  scores.sort((a, b) => b.score - a.score)

  // 分配排名（处理并列情况）
  let currentRank = 1
  scores.forEach((item, index) => {
    if (index > 0 && item.score < scores[index - 1].score) {
      currentRank = index + 1
    }
    item.rank = currentRank
  })

  return scores
}

/**
 * 检查父维度是否应该自动计算（有子维度）
 * @param dimension 维度对象
 * @returns 是否应该自动计算
 */
export function shouldAutoCalculate(dimension: Dimension): boolean {
  return !!(dimension.subDimensions && dimension.subDimensions.length > 0)
}

/**
 * 为所有有子维度的父维度自动计算分数
 * @param dimensions 维度列表
 * @param vendors 竞品列表
 * @returns 更新后的维度列表
 */
export function recalculateAllParentScores(
  dimensions: Dimension[],
  vendors: Vendor[]
): Dimension[] {
  return dimensions.map((dimension) => {
    if (shouldAutoCalculate(dimension)) {
      // 为每个竞品计算该维度的分数
      const newScores: Record<string, number> = {}
      vendors.forEach((vendor) => {
        newScores[vendor.id] = calculateParentScore(
          dimension.subDimensions!,
          vendor.id
        )
      })

      return {
        ...dimension,
        scores: newScores,
      }
    }
    return dimension
  })
}
