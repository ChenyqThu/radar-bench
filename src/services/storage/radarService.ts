/**
 * 雷达图存储服务
 * 提供对 IndexedDB 的封装和 LocalStorage 降级方案
 */

import { db } from './db'
import type { RadarChart } from '@/types'
import type { StorageService } from './types'

/**
 * 存储键前缀（用于 LocalStorage 降级）
 */
const STORAGE_PREFIX = 'radar-bench'
const CHARTS_KEY = `${STORAGE_PREFIX}:charts`
const SETTINGS_PREFIX = `${STORAGE_PREFIX}:settings`

/**
 * 检查 IndexedDB 是否可用
 */
function isIndexedDBAvailable(): boolean {
  try {
    return typeof indexedDB !== 'undefined'
  } catch {
    return false
  }
}

/**
 * IndexedDB 存储服务实现
 */
const indexedDBService: StorageService = {
  async saveRadarChart(chart: RadarChart) {
    await db.radarCharts.put(chart)
  },

  async getRadarChart(id: string) {
    return await db.radarCharts.get(id)
  },

  async getAllRadarCharts() {
    return await db.radarCharts.toArray()
  },

  async deleteRadarChart(id: string) {
    await db.radarCharts.delete(id)
  },

  async clearAllRadarCharts() {
    await db.radarCharts.clear()
  },

  async saveAppSettings(key: string, value: unknown) {
    await db.appSettings.put({ key, value })
  },

  async getAppSettings(key: string) {
    const result = await db.appSettings.get(key)
    return result?.value
  },

  async deleteAppSettings(key: string) {
    await db.appSettings.delete(key)
  },
}

/**
 * LocalStorage 降级存储服务实现
 */
const localStorageService: StorageService = {
  async saveRadarChart(chart: RadarChart) {
    const charts = await this.getAllRadarCharts()
    const index = charts.findIndex((c) => c.id === chart.id)
    if (index >= 0) {
      charts[index] = chart
    } else {
      charts.push(chart)
    }
    localStorage.setItem(CHARTS_KEY, JSON.stringify(charts))
  },

  async getRadarChart(id: string) {
    const charts = await this.getAllRadarCharts()
    return charts.find((c) => c.id === id)
  },

  async getAllRadarCharts() {
    try {
      const data = localStorage.getItem(CHARTS_KEY)
      if (!data) return []
      const charts = JSON.parse(data) as RadarChart[]
      // 恢复 Date 对象
      return charts.map((chart) => ({
        ...chart,
        createdAt: new Date(chart.createdAt),
        updatedAt: new Date(chart.updatedAt),
      }))
    } catch (error) {
      console.error('Failed to load charts from localStorage:', error)
      return []
    }
  },

  async deleteRadarChart(id: string) {
    const charts = await this.getAllRadarCharts()
    const filtered = charts.filter((c) => c.id !== id)
    localStorage.setItem(CHARTS_KEY, JSON.stringify(filtered))
  },

  async clearAllRadarCharts() {
    localStorage.removeItem(CHARTS_KEY)
  },

  async saveAppSettings(key: string, value: unknown) {
    const settingsKey = `${SETTINGS_PREFIX}:${key}`
    localStorage.setItem(settingsKey, JSON.stringify(value))
  },

  async getAppSettings(key: string) {
    const settingsKey = `${SETTINGS_PREFIX}:${key}`
    const data = localStorage.getItem(settingsKey)
    if (!data) return undefined
    try {
      return JSON.parse(data)
    } catch {
      return data
    }
  },

  async deleteAppSettings(key: string) {
    const settingsKey = `${SETTINGS_PREFIX}:${key}`
    localStorage.removeItem(settingsKey)
  },
}

/**
 * 自动选择存储服务（IndexedDB 优先，降级到 LocalStorage）
 */
export const storageService: StorageService = isIndexedDBAvailable()
  ? indexedDBService
  : localStorageService

/**
 * 导出便捷函数
 */

/** 保存雷达图 */
export const saveRadarChart = (chart: RadarChart) =>
  storageService.saveRadarChart(chart)

/** 获取单个雷达图 */
export const getRadarChart = (id: string) => storageService.getRadarChart(id)

/** 获取所有雷达图 */
export const getAllRadarCharts = () => storageService.getAllRadarCharts()

/** 删除雷达图 */
export const deleteRadarChart = (id: string) =>
  storageService.deleteRadarChart(id)

/** 清空所有雷达图 */
export const clearAllRadarCharts = () => storageService.clearAllRadarCharts()

/** 保存应用设置 */
export const saveAppSettings = (key: string, value: unknown) =>
  storageService.saveAppSettings(key, value)

/** 获取应用设置 */
export const getAppSettings = (key: string) =>
  storageService.getAppSettings(key)

/** 删除应用设置 */
export const deleteAppSettings = (key: string) =>
  storageService.deleteAppSettings(key)
