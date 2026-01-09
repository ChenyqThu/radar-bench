/**
 * Zustand Store 实现
 */

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type { RadarStore } from './types'
import type {
  RadarChart,
  CreateRadarChartInput,
  Vendor,
  CreateVendorInput,
  Dimension,
  CreateDimensionInput,
  SubDimension,
  CreateSubDimensionInput,
} from '@/types'
import { DEFAULT_RADAR_CHART_NAME } from '@/lib/constants'

/**
 * 初始状态
 */
const initialState = {
  radarCharts: [],
  activeChartId: null,
  isLoading: false,
  lastSaved: null,
}

/**
 * 创建 Radar Store
 */
export const useRadarStore = create<RadarStore>()(
  devtools(
    immer((set, get) => ({
      // ============ State ============
      ...initialState,

      // ============ RadarChart Actions ============
      addRadarChart: (input: CreateRadarChartInput) => {
        const id = nanoid()
        const now = new Date()
        const state = get()
        // 新雷达图的 order 为当前最大 order + 1
        const maxOrder =
          state.radarCharts.length > 0
            ? Math.max(...state.radarCharts.map((c) => c.order))
            : -1
        const newChart: RadarChart = {
          id,
          name: input.name || DEFAULT_RADAR_CHART_NAME,
          order: maxOrder + 1,
          createdAt: now,
          updatedAt: now,
          vendors: input.vendors || [],
          dimensions: input.dimensions || [],
        }

        set((state) => {
          state.radarCharts.push(newChart)
        })

        return id
      },

      updateRadarChart: (id: string, updates) => {
        set((state) => {
          const chart = state.radarCharts.find((c: RadarChart) => c.id === id)
          if (chart) {
            if (updates.name !== undefined) chart.name = updates.name
            if (updates.order !== undefined) chart.order = updates.order
            if (updates.vendors !== undefined) chart.vendors = updates.vendors
            if (updates.dimensions !== undefined)
              chart.dimensions = updates.dimensions
            chart.updatedAt = new Date()
          }
        })
      },

      deleteRadarChart: (id: string) => {
        set((state) => {
          state.radarCharts = state.radarCharts.filter(
            (c: RadarChart) => c.id !== id
          )
          if (state.activeChartId === id) {
            state.activeChartId = null
          }
        })
      },

      setActiveChart: (id: string | null) => {
        set((state) => {
          state.activeChartId = id
        })
      },

      getActiveChart: () => {
        const state = get()
        if (!state.activeChartId) return null
        return (
          state.radarCharts.find(
            (c: RadarChart) => c.id === state.activeChartId
          ) || null
        )
      },

      reorderCharts: (chartIds: string[]) => {
        set((state) => {
          chartIds.forEach((id, index) => {
            const chart = state.radarCharts.find((c: RadarChart) => c.id === id)
            if (chart) {
              chart.order = index
            }
          })
          // 按 order 排序
          state.radarCharts.sort(
            (a: RadarChart, b: RadarChart) => a.order - b.order
          )
        })
      },

      renameRadarChart: (id: string, name: string) => {
        set((state) => {
          const chart = state.radarCharts.find((c: RadarChart) => c.id === id)
          if (chart) {
            chart.name = name
            chart.updatedAt = new Date()
          }
        })
      },

      duplicateRadarChart: (id: string) => {
        const state = get()
        const sourceChart = state.radarCharts.find(
          (c: RadarChart) => c.id === id
        )
        if (!sourceChart) return null

        const newId = nanoid()
        const now = new Date()
        const maxOrder =
          state.radarCharts.length > 0
            ? Math.max(...state.radarCharts.map((c) => c.order))
            : -1

        // 深拷贝雷达图，生成新的 ID
        const newChart: RadarChart = {
          ...sourceChart,
          id: newId,
          name: `${sourceChart.name} (Copy)`,
          order: maxOrder + 1,
          createdAt: now,
          updatedAt: now,
          // 深拷贝 vendors 和 dimensions
          vendors: sourceChart.vendors.map((v) => ({ ...v, id: nanoid() })),
          dimensions: sourceChart.dimensions.map((d) => {
            const newDimId = nanoid()
            // 更新 scores 中的 vendorId 映射
            const vendorIdMap = new Map<string, string>()
            sourceChart.vendors.forEach((oldV, idx) => {
              vendorIdMap.set(oldV.id, newChart.vendors[idx].id)
            })

            const newScores: Record<string, number> = {}
            Object.entries(d.scores).forEach(([oldVendorId, score]) => {
              const newVendorId = vendorIdMap.get(oldVendorId)
              if (newVendorId) {
                newScores[newVendorId] = score
              }
            })

            return {
              ...d,
              id: newDimId,
              scores: newScores,
              subDimensions: d.subDimensions?.map((sub) => {
                const newSubScores: Record<string, number> = {}
                Object.entries(sub.scores).forEach(([oldVendorId, score]) => {
                  const newVendorId = vendorIdMap.get(oldVendorId)
                  if (newVendorId) {
                    newSubScores[newVendorId] = score
                  }
                })
                return {
                  ...sub,
                  id: nanoid(),
                  scores: newSubScores,
                }
              }),
            }
          }),
        }

        set((state) => {
          state.radarCharts.push(newChart)
        })

        return newId
      },

      // ============ Vendor Actions ============
      addVendor: (chartId: string, input: CreateVendorInput) => {
        const id = nanoid()
        const newVendor: Vendor = {
          id,
          ...input,
        }

        set((state) => {
          const chart = state.radarCharts.find(
            (c: RadarChart) => c.id === chartId
          )
          if (chart) {
            chart.vendors.push(newVendor)
            chart.updatedAt = new Date()
          }
        })

        return id
      },

      updateVendor: (chartId: string, vendorId: string, updates) => {
        set((state) => {
          const chart = state.radarCharts.find(
            (c: RadarChart) => c.id === chartId
          )
          if (chart) {
            const vendor = chart.vendors.find((v: Vendor) => v.id === vendorId)
            if (vendor) {
              if (updates.name !== undefined) vendor.name = updates.name
              if (updates.color !== undefined) vendor.color = updates.color
              if (updates.symbol !== undefined) vendor.symbol = updates.symbol
              if (updates.order !== undefined) vendor.order = updates.order
              chart.updatedAt = new Date()
            }
          }
        })
      },

      deleteVendor: (chartId: string, vendorId: string) => {
        set((state) => {
          const chart = state.radarCharts.find(
            (c: RadarChart) => c.id === chartId
          )
          if (chart) {
            chart.vendors = chart.vendors.filter(
              (v: Vendor) => v.id !== vendorId
            )
            // 同时删除所有维度和子维度中该 vendor 的分数
            chart.dimensions.forEach((dim: Dimension) => {
              delete dim.scores[vendorId]
              if (dim.subDimensions) {
                dim.subDimensions.forEach((sub: SubDimension) => {
                  delete sub.scores[vendorId]
                })
              }
            })
            chart.updatedAt = new Date()
          }
        })
      },

      reorderVendors: (chartId: string, vendorIds: string[]) => {
        set((state) => {
          const chart = state.radarCharts.find(
            (c: RadarChart) => c.id === chartId
          )
          if (chart) {
            // 根据新的顺序更新 order 字段
            vendorIds.forEach((id, index) => {
              const vendor = chart.vendors.find((v: Vendor) => v.id === id)
              if (vendor) {
                vendor.order = index
              }
            })
            // 按 order 排序
            chart.vendors.sort((a: Vendor, b: Vendor) => a.order - b.order)
            chart.updatedAt = new Date()
          }
        })
      },

      // ============ Dimension Actions ============
      addDimension: (chartId: string, input: CreateDimensionInput) => {
        const id = nanoid()
        const newDimension: Dimension = {
          id,
          ...input,
        }

        set((state) => {
          const chart = state.radarCharts.find(
            (c: RadarChart) => c.id === chartId
          )
          if (chart) {
            chart.dimensions.push(newDimension)
            chart.updatedAt = new Date()
          }
        })

        return id
      },

      updateDimension: (chartId: string, dimensionId: string, updates) => {
        set((state) => {
          const chart = state.radarCharts.find(
            (c: RadarChart) => c.id === chartId
          )
          if (chart) {
            const dimension = chart.dimensions.find(
              (d: Dimension) => d.id === dimensionId
            )
            if (dimension) {
              if (updates.name !== undefined) dimension.name = updates.name
              if (updates.description !== undefined)
                dimension.description = updates.description
              if (updates.weight !== undefined)
                dimension.weight = updates.weight
              if (updates.order !== undefined) dimension.order = updates.order
              if (updates.scores !== undefined)
                dimension.scores = updates.scores
              if (updates.subDimensions !== undefined)
                dimension.subDimensions = updates.subDimensions
              chart.updatedAt = new Date()
            }
          }
        })
      },

      deleteDimension: (chartId: string, dimensionId: string) => {
        set((state) => {
          const chart = state.radarCharts.find(
            (c: RadarChart) => c.id === chartId
          )
          if (chart) {
            chart.dimensions = chart.dimensions.filter(
              (d: Dimension) => d.id !== dimensionId
            )
            chart.updatedAt = new Date()
          }
        })
      },

      reorderDimensions: (chartId: string, dimensionIds: string[]) => {
        set((state) => {
          const chart = state.radarCharts.find(
            (c: RadarChart) => c.id === chartId
          )
          if (chart) {
            dimensionIds.forEach((id, index) => {
              const dimension = chart.dimensions.find(
                (d: Dimension) => d.id === id
              )
              if (dimension) {
                dimension.order = index
              }
            })
            chart.dimensions.sort(
              (a: Dimension, b: Dimension) => a.order - b.order
            )
            chart.updatedAt = new Date()
          }
        })
      },

      updateDimensionScore: (
        chartId: string,
        dimensionId: string,
        vendorId: string,
        score: number
      ) => {
        set((state) => {
          const chart = state.radarCharts.find(
            (c: RadarChart) => c.id === chartId
          )
          if (chart) {
            const dimension = chart.dimensions.find(
              (d: Dimension) => d.id === dimensionId
            )
            if (dimension) {
              dimension.scores[vendorId] = score
              chart.updatedAt = new Date()
            }
          }
        })
      },

      // ============ SubDimension Actions ============
      addSubDimension: (
        chartId: string,
        dimensionId: string,
        input: CreateSubDimensionInput
      ) => {
        const id = nanoid()
        const newSubDimension: SubDimension = {
          id,
          ...input,
        }

        set((state) => {
          const chart = state.radarCharts.find(
            (c: RadarChart) => c.id === chartId
          )
          if (chart) {
            const dimension = chart.dimensions.find(
              (d: Dimension) => d.id === dimensionId
            )
            if (dimension) {
              if (!dimension.subDimensions) {
                dimension.subDimensions = []
              }
              dimension.subDimensions.push(newSubDimension)
              chart.updatedAt = new Date()
            }
          }
        })

        return id
      },

      updateSubDimension: (
        chartId: string,
        dimensionId: string,
        subDimensionId: string,
        updates
      ) => {
        set((state) => {
          const chart = state.radarCharts.find(
            (c: RadarChart) => c.id === chartId
          )
          if (chart) {
            const dimension = chart.dimensions.find(
              (d: Dimension) => d.id === dimensionId
            )
            if (dimension && dimension.subDimensions) {
              const subDimension = dimension.subDimensions.find(
                (s: SubDimension) => s.id === subDimensionId
              )
              if (subDimension) {
                if (updates.name !== undefined) subDimension.name = updates.name
                if (updates.description !== undefined)
                  subDimension.description = updates.description
                if (updates.weight !== undefined)
                  subDimension.weight = updates.weight
                if (updates.order !== undefined)
                  subDimension.order = updates.order
                if (updates.scores !== undefined)
                  subDimension.scores = updates.scores
                chart.updatedAt = new Date()
              }
            }
          }
        })
      },

      deleteSubDimension: (
        chartId: string,
        dimensionId: string,
        subDimensionId: string
      ) => {
        set((state) => {
          const chart = state.radarCharts.find(
            (c: RadarChart) => c.id === chartId
          )
          if (chart) {
            const dimension = chart.dimensions.find(
              (d: Dimension) => d.id === dimensionId
            )
            if (dimension && dimension.subDimensions) {
              dimension.subDimensions = dimension.subDimensions.filter(
                (s: SubDimension) => s.id !== subDimensionId
              )
              chart.updatedAt = new Date()
            }
          }
        })
      },

      reorderSubDimensions: (
        chartId: string,
        dimensionId: string,
        subDimensionIds: string[]
      ) => {
        set((state) => {
          const chart = state.radarCharts.find(
            (c: RadarChart) => c.id === chartId
          )
          if (chart) {
            const dimension = chart.dimensions.find(
              (d: Dimension) => d.id === dimensionId
            )
            if (dimension && dimension.subDimensions) {
              subDimensionIds.forEach((id, index) => {
                const subDimension = dimension.subDimensions!.find(
                  (s: SubDimension) => s.id === id
                )
                if (subDimension) {
                  subDimension.order = index
                }
              })
              dimension.subDimensions.sort(
                (a: SubDimension, b: SubDimension) => a.order - b.order
              )
              chart.updatedAt = new Date()
            }
          }
        })
      },

      updateSubDimensionScore: (
        chartId: string,
        dimensionId: string,
        subDimensionId: string,
        vendorId: string,
        score: number
      ) => {
        set((state) => {
          const chart = state.radarCharts.find(
            (c: RadarChart) => c.id === chartId
          )
          if (chart) {
            const dimension = chart.dimensions.find(
              (d: Dimension) => d.id === dimensionId
            )
            if (dimension && dimension.subDimensions) {
              const subDimension = dimension.subDimensions.find(
                (s: SubDimension) => s.id === subDimensionId
              )
              if (subDimension) {
                subDimension.scores[vendorId] = score
                chart.updatedAt = new Date()
              }
            }
          }
        })
      },

      // ============ Storage Actions ============
      loadFromStorage: async () => {
        set((state) => {
          state.isLoading = true
        })

        try {
          const { getAllRadarCharts, getAppSettings } =
            await import('@/services/storage/radarService')
          const { generateSampleRadarChart } = await import('@/lib/mockData')

          // 加载所有雷达图
          let charts = await getAllRadarCharts()

          // 如果没有数据，创建示例雷达图
          if (charts.length === 0) {
            const sampleChart = generateSampleRadarChart()
            charts = [sampleChart]
            // 保存示例数据
            const { saveRadarChart } =
              await import('@/services/storage/radarService')
            await saveRadarChart(sampleChart)
          }

          // 数据迁移：为旧数据添加 order 字段
          charts = charts.map((chart, index) => {
            if (chart.order === undefined) {
              return { ...chart, order: index }
            }
            return chart
          })

          // 按 order 排序
          charts.sort((a: RadarChart, b: RadarChart) => a.order - b.order)

          // 加载激活的雷达图 ID
          let activeChartId = (await getAppSettings('activeChartId')) as
            | string
            | null

          // 如果没有激活的雷达图，默认激活第一个
          if (!activeChartId && charts.length > 0) {
            activeChartId = charts[0].id
          }

          set((state) => {
            state.radarCharts = charts
            state.activeChartId = activeChartId
            state.isLoading = false
          })
        } catch (error) {
          console.error('Failed to load data from storage:', error)
          set((state) => {
            state.isLoading = false
          })
        }
      },

      saveToStorage: async () => {
        try {
          const state = get()
          const { saveRadarChart, saveAppSettings } =
            await import('@/services/storage/radarService')

          // 保存所有雷达图
          await Promise.all(
            state.radarCharts.map((chart) => saveRadarChart(chart))
          )

          // 保存激活的雷达图 ID
          if (state.activeChartId) {
            await saveAppSettings('activeChartId', state.activeChartId)
          }

          // 更新最后保存时间
          set((state) => {
            state.lastSaved = new Date()
          })
        } catch (error) {
          console.error('Failed to save data to storage:', error)
        }
      },

      setLoading: (isLoading: boolean) => {
        set((state) => {
          state.isLoading = isLoading
        })
      },

      updateLastSaved: () => {
        set((state) => {
          state.lastSaved = new Date()
        })
      },
    })),
    { name: 'RadarStore' }
  )
)

/**
 * 自动保存机制
 * 监听 Store 状态变化，防抖后自动保存到存储
 */
let saveTimeout: ReturnType<typeof setTimeout> | null = null
const AUTO_SAVE_DEBOUNCE_MS = 300

useRadarStore.subscribe((state) => {
  // 清除之前的定时器
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }

  // 设置新的定时器
  saveTimeout = setTimeout(() => {
    state.saveToStorage()
  }, AUTO_SAVE_DEBOUNCE_MS)
})
