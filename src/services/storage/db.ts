/**
 * Dexie 数据库定义
 */

import Dexie, { type EntityTable } from 'dexie'
import type { RadarChart } from '@/types'
import type { AppSetting } from './types'
import { DB_NAME, DB_VERSION } from '@/lib/constants'

/**
 * Radar Bench 数据库类
 */
export class RadarDatabase extends Dexie {
  // 定义表
  radarCharts!: EntityTable<RadarChart, 'id'>
  appSettings!: EntityTable<AppSetting, 'key'>

  constructor() {
    super(DB_NAME)

    // 定义数据库 schema（版本 1）
    this.version(DB_VERSION).stores({
      radarCharts: 'id, name, createdAt, updatedAt',
      appSettings: 'key',
    })
  }
}

/**
 * 数据库实例
 */
export const db = new RadarDatabase()
