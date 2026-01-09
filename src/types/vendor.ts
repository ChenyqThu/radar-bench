/**
 * 竞品系列相关类型定义
 */

/**
 * 标记类型
 */
export type SymbolType = 'circle' | 'rect' | 'triangle' | 'diamond'

/**
 * 竞品系列（Vendor）
 * 代表雷达图中的一个系列数据，通常对应一个产品或竞品
 */
export interface Vendor {
  /** 唯一标识 */
  id: string
  /** 系列名称（如 "Omada", "Competitor A"） */
  name: string
  /** 颜色（HEX 格式，如 "#3B82F6"） */
  color: string
  /** 标记类型 */
  symbol: SymbolType
  /** 排序序号（用于控制显示顺序） */
  order: number
}

/**
 * 创建 Vendor 时的输入类型（不包含 id）
 */
export type CreateVendorInput = Omit<Vendor, 'id'>

/**
 * 更新 Vendor 时的输入类型（所有字段可选）
 */
export type UpdateVendorInput = Partial<Omit<Vendor, 'id'>>
