/**
 * 应用常量定义
 */

// 分数范围
export const SCORE_MIN = 0
export const SCORE_MAX = 10

// 权重范围
export const WEIGHT_MIN = 0
export const WEIGHT_MAX = 100
export const WEIGHT_TOTAL = 100

// 默认颜色（用于竞品系列）
export const DEFAULT_COLORS = [
  '#3B82F6', // 蓝色
  '#10B981', // 绿色
  '#F59E0B', // 橙色
  '#EF4444', // 红色
  '#8B5CF6', // 紫色
  '#EC4899', // 粉色
  '#14B8A6', // 青色
  '#F97316', // 深橙色
]

// 默认标记类型
export const DEFAULT_SYMBOLS = [
  'circle',
  'rect',
  'triangle',
  'diamond',
] as const

// 字段长度限制
export const MAX_NAME_LENGTH = 100
export const MAX_DESCRIPTION_LENGTH = 500

// 数据库名称
export const DB_NAME = 'RadarBenchDB'
export const DB_VERSION = 1

// 本地存储键
export const STORAGE_KEYS = {
  ACTIVE_CHART_ID: 'activeChartId',
  LAST_SAVED: 'lastSaved',
  LANGUAGE: 'language',
  THEME: 'theme',
} as const

// 防抖延迟（毫秒）
export const AUTO_SAVE_DEBOUNCE_MS = 300

// 默认雷达图名称
export const DEFAULT_RADAR_CHART_NAME = 'New Radar Chart'

// 默认竞品名称
export const DEFAULT_VENDOR_NAME = 'New Vendor'

// 默认维度名称
export const DEFAULT_DIMENSION_NAME = 'New Dimension'

// 默认子维度名称
export const DEFAULT_SUB_DIMENSION_NAME = 'New Sub Dimension'
