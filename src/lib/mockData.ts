/**
 * 示例数据生成器
 * 用于首次启动时创建示例雷达图
 */

import { nanoid } from 'nanoid'
import type { RadarChart, Vendor, Dimension } from '@/types'
import { DEFAULT_COLORS, DEFAULT_SYMBOLS } from './constants'

/**
 * 生成示例雷达图
 */
export function generateSampleRadarChart(): RadarChart {
  const now = new Date()

  // 创建两个竞品系列
  const vendors: Vendor[] = [
    {
      id: nanoid(),
      name: 'Omada',
      color: DEFAULT_COLORS[0],
      symbol: DEFAULT_SYMBOLS[0],
      order: 0,
    },
    {
      id: nanoid(),
      name: 'Competitor A',
      color: DEFAULT_COLORS[1],
      symbol: DEFAULT_SYMBOLS[1],
      order: 1,
    },
  ]

  // 创建一级维度（包含子维度示例）
  const dimensions: Dimension[] = [
    {
      id: nanoid(),
      name: 'Product Features',
      description: '产品功能完整性和创新性',
      weight: 30,
      order: 0,
      scores: {
        [vendors[0].id]: 8,
        [vendors[1].id]: 7,
      },
      subDimensions: [
        {
          id: nanoid(),
          name: 'Core Functionality',
          description: '核心功能的完整性',
          weight: 50,
          order: 0,
          scores: {
            [vendors[0].id]: 9,
            [vendors[1].id]: 7,
          },
        },
        {
          id: nanoid(),
          name: 'Innovation',
          description: '创新性和差异化特性',
          weight: 30,
          order: 1,
          scores: {
            [vendors[0].id]: 8,
            [vendors[1].id]: 6,
          },
        },
        {
          id: nanoid(),
          name: 'Extensibility',
          description: '可扩展性和集成能力',
          weight: 20,
          order: 2,
          scores: {
            [vendors[0].id]: 7,
            [vendors[1].id]: 8,
          },
        },
      ],
    },
    {
      id: nanoid(),
      name: 'Performance',
      description: '系统性能和响应速度',
      weight: 25,
      order: 1,
      scores: {
        [vendors[0].id]: 9,
        [vendors[1].id]: 8,
      },
    },
    {
      id: nanoid(),
      name: 'User Experience',
      description: '用户界面和交互体验',
      weight: 20,
      order: 2,
      scores: {
        [vendors[0].id]: 8,
        [vendors[1].id]: 7,
      },
    },
    {
      id: nanoid(),
      name: 'Security',
      description: '安全性和合规性',
      weight: 15,
      order: 3,
      scores: {
        [vendors[0].id]: 9,
        [vendors[1].id]: 9,
      },
    },
    {
      id: nanoid(),
      name: 'Support & Documentation',
      description: '技术支持和文档质量',
      weight: 10,
      order: 4,
      scores: {
        [vendors[0].id]: 7,
        [vendors[1].id]: 6,
      },
    },
  ]

  return {
    id: nanoid(),
    name: 'Sample Radar Chart',
    createdAt: now,
    updatedAt: now,
    vendors,
    dimensions,
  }
}
