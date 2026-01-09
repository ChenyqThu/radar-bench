import { describe, it, expect } from 'vitest'
import {
  calculateParentScore,
  calculateTotalScore,
  getRankings,
  shouldAutoCalculate,
  recalculateAllParentScores,
} from './calculations'
import type { Dimension, SubDimension, Vendor } from '@/types'

describe('calculations', () => {
  describe('calculateParentScore', () => {
    it('should return 0 for empty sub-dimensions', () => {
      const result = calculateParentScore([], 'vendor1')
      expect(result).toBe(0)
    })

    it('should calculate weighted average correctly', () => {
      const subDimensions: SubDimension[] = [
        {
          id: 'sub1',
          name: 'Sub 1',
          weight: 60,
          order: 0,
          scores: { vendor1: 8 },
        },
        {
          id: 'sub2',
          name: 'Sub 2',
          weight: 40,
          order: 1,
          scores: { vendor1: 6 },
        },
      ]
      const result = calculateParentScore(subDimensions, 'vendor1')
      expect(result).toBe(7.2)
    })
  })

  describe('calculateTotalScore', () => {
    it('should return 0 for empty dimensions', () => {
      const result = calculateTotalScore([], 'vendor1')
      expect(result).toBe(0)
    })

    it('should calculate weighted total score correctly', () => {
      const dimensions: Dimension[] = [
        {
          id: 'dim1',
          name: 'Dimension 1',
          weight: 30,
          scores: { vendor1: 8 },
          order: 0,
        },
        {
          id: 'dim2',
          name: 'Dimension 2',
          weight: 70,
          scores: { vendor1: 6 },
          order: 1,
        },
      ]
      const result = calculateTotalScore(dimensions, 'vendor1')
      expect(result).toBe(6.6)
    })
  })

  describe('getRankings', () => {
    it('should generate rankings sorted by score', () => {
      const dimensions: Dimension[] = [
        {
          id: 'dim1',
          name: 'Dimension 1',
          weight: 100,
          scores: { v1: 9, v2: 7, v3: 5 },
          order: 0,
        },
      ]

      const vendors: Vendor[] = [
        {
          id: 'v1',
          name: 'Vendor 1',
          color: '#ff0000',
          symbol: 'circle',
          order: 0,
        },
        {
          id: 'v2',
          name: 'Vendor 2',
          color: '#00ff00',
          symbol: 'rect',
          order: 1,
        },
        {
          id: 'v3',
          name: 'Vendor 3',
          color: '#0000ff',
          symbol: 'triangle',
          order: 2,
        },
      ]

      const rankings = getRankings(dimensions, vendors)

      expect(rankings[0].vendor.id).toBe('v1')
      expect(rankings[0].rank).toBe(1)
      expect(rankings[1].vendor.id).toBe('v2')
      expect(rankings[1].rank).toBe(2)
      expect(rankings[2].vendor.id).toBe('v3')
      expect(rankings[2].rank).toBe(3)
    })
  })

  describe('shouldAutoCalculate', () => {
    it('should return true for dimension with sub-dimensions', () => {
      const dimension: Dimension = {
        id: 'dim1',
        name: 'Dimension 1',
        weight: 50,
        scores: {},
        order: 0,
        subDimensions: [
          {
            id: 'sub1',
            name: 'Sub 1',
            weight: 100,
            order: 0,
            scores: {},
          },
        ],
      }

      expect(shouldAutoCalculate(dimension)).toBe(true)
    })

    it('should return false for dimension without sub-dimensions', () => {
      const dimension: Dimension = {
        id: 'dim1',
        name: 'Dimension 1',
        weight: 50,
        scores: {},
        order: 0,
      }

      expect(shouldAutoCalculate(dimension)).toBe(false)
    })
  })

  describe('recalculateAllParentScores', () => {
    it('should recalculate scores for dimensions with sub-dimensions', () => {
      const dimensions: Dimension[] = [
        {
          id: 'dim1',
          name: 'Dimension 1',
          weight: 50,
          scores: { v1: 0, v2: 0 },
          order: 0,
          subDimensions: [
            {
              id: 'sub1',
              name: 'Sub 1',
              weight: 60,
              order: 0,
              scores: { v1: 8, v2: 6 },
            },
            {
              id: 'sub2',
              name: 'Sub 2',
              weight: 40,
              order: 1,
              scores: { v1: 6, v2: 8 },
            },
          ],
        },
      ]

      const vendors: Vendor[] = [
        {
          id: 'v1',
          name: 'Vendor 1',
          color: '#ff0000',
          symbol: 'circle',
          order: 0,
        },
        {
          id: 'v2',
          name: 'Vendor 2',
          color: '#00ff00',
          symbol: 'rect',
          order: 1,
        },
      ]

      const result = recalculateAllParentScores(dimensions, vendors)

      expect(result[0].scores.v1).toBe(7.2)
      expect(result[0].scores.v2).toBe(6.8)
    })
  })
})
