import { describe, it, expect } from 'vitest'
import {
  isWeightValid,
  isScoreValid,
  validateDimensionsWeight,
  validateSubDimensionsWeight,
  validateAllWeights,
  validateScores,
  normalizeWeights,
  distributeWeightsEvenly,
} from './validators'
import type { Dimension, SubDimension } from '@/types'

describe('validators', () => {
  describe('isWeightValid', () => {
    it('should return true for valid weights', () => {
      expect(isWeightValid(0)).toBe(true)
      expect(isWeightValid(50)).toBe(true)
      expect(isWeightValid(100)).toBe(true)
    })

    it('should return false for invalid weights', () => {
      expect(isWeightValid(-1)).toBe(false)
      expect(isWeightValid(101)).toBe(false)
    })
  })

  describe('isScoreValid', () => {
    it('should return true for valid integer scores', () => {
      expect(isScoreValid(0)).toBe(true)
      expect(isScoreValid(5)).toBe(true)
      expect(isScoreValid(10)).toBe(true)
    })

    it('should return false for non-integer scores', () => {
      expect(isScoreValid(5.5)).toBe(false)
    })

    it('should return false for out-of-range scores', () => {
      expect(isScoreValid(-1)).toBe(false)
      expect(isScoreValid(11)).toBe(false)
    })
  })

  describe('validateDimensionsWeight', () => {
    it('should validate dimensions with total weight of 100', () => {
      const dimensions: Dimension[] = [
        { id: 'dim1', name: 'Dim 1', weight: 50, scores: {}, order: 0 },
        { id: 'dim2', name: 'Dim 2', weight: 50, scores: {}, order: 1 },
      ]

      const result = validateDimensionsWeight(dimensions)

      expect(result.isValid).toBe(true)
      expect(result.total).toBe(100)
    })

    it('should invalidate dimensions with incorrect total weight', () => {
      const dimensions: Dimension[] = [
        { id: 'dim1', name: 'Dim 1', weight: 40, scores: {}, order: 0 },
        { id: 'dim2', name: 'Dim 2', weight: 50, scores: {}, order: 1 },
      ]

      const result = validateDimensionsWeight(dimensions)

      expect(result.isValid).toBe(false)
      expect(result.total).toBe(90)
    })
  })

  describe('validateSubDimensionsWeight', () => {
    it('should validate sub-dimensions with total weight of 100', () => {
      const subDimensions: SubDimension[] = [
        { id: 'sub1', name: 'Sub 1', weight: 60, order: 0, scores: {} },
        { id: 'sub2', name: 'Sub 2', weight: 40, order: 1, scores: {} },
      ]

      const result = validateSubDimensionsWeight(
        subDimensions,
        'dim1',
        'Parent Dimension'
      )

      expect(result.isValid).toBe(true)
      expect(result.total).toBe(100)
    })

    it('should invalidate sub-dimensions with incorrect total weight', () => {
      const subDimensions: SubDimension[] = [
        { id: 'sub1', name: 'Sub 1', weight: 60, order: 0, scores: {} },
        { id: 'sub2', name: 'Sub 2', weight: 30, order: 1, scores: {} },
      ]

      const result = validateSubDimensionsWeight(
        subDimensions,
        'dim1',
        'Parent Dimension'
      )

      expect(result.isValid).toBe(false)
      expect(result.total).toBe(90)
    })
  })

  describe('validateAllWeights', () => {
    it('should validate all weights correctly', () => {
      const dimensions: Dimension[] = [
        {
          id: 'dim1',
          name: 'Dim 1',
          weight: 50,
          scores: {},
          order: 0,
          subDimensions: [
            { id: 'sub1', name: 'Sub 1', weight: 60, order: 0, scores: {} },
            { id: 'sub2', name: 'Sub 2', weight: 40, order: 1, scores: {} },
          ],
        },
        { id: 'dim2', name: 'Dim 2', weight: 50, scores: {}, order: 1 },
      ]

      const errors = validateAllWeights(dimensions)

      expect(errors).toHaveLength(0)
    })
  })

  describe('validateScores', () => {
    it('should validate valid scores', () => {
      const scores = { v1: 5, v2: 8, v3: 10 }

      const errors = validateScores(scores)

      expect(errors).toHaveLength(0)
    })

    it('should invalidate non-integer scores', () => {
      const scores = { v1: 5.5, v2: 8 }

      const errors = validateScores(scores)

      expect(errors.length).toBeGreaterThan(0)
    })
  })

  describe('normalizeWeights', () => {
    it('should normalize weights to sum to 100', () => {
      const weights = [30, 30, 30]

      const normalized = normalizeWeights(weights)

      const total = normalized.reduce((sum, w) => sum + w, 0)
      expect(total).toBeCloseTo(100, 0)
    })
  })

  describe('distributeWeightsEvenly', () => {
    it('should distribute weights evenly when divisible', () => {
      const weights = distributeWeightsEvenly(4)

      expect(weights).toEqual([25, 25, 25, 25])
      expect(weights.reduce((sum, w) => sum + w, 0)).toBe(100)
    })

    it('should handle non-divisible distribution', () => {
      const weights = distributeWeightsEvenly(3)

      expect(weights.reduce((sum, w) => sum + w, 0)).toBe(100)
      expect(weights).toEqual([34, 33, 33])
    })
  })
})
