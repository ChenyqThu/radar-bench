/**
 * Vendor 数据验证 Schema
 */

import { z } from 'zod'
import { MAX_NAME_LENGTH } from '@/lib/constants'

/**
 * SymbolType Schema
 */
export const SymbolTypeSchema = z.enum([
  'circle',
  'rect',
  'triangle',
  'diamond',
])

/**
 * Vendor Schema
 */
export const VendorSchema = z.object({
  id: z.string().min(1, 'ID 不能为空'),
  name: z
    .string()
    .min(1, '名称不能为空')
    .max(MAX_NAME_LENGTH, `名称长度不能超过 ${MAX_NAME_LENGTH} 个字符`),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, '颜色格式错误，应为 HEX 格式（如 #3B82F6）'),
  symbol: SymbolTypeSchema,
  order: z.number().int('排序序号必须为整数').min(0, '排序序号不能为负数'),
})

/**
 * CreateVendorInput Schema（不包含 id）
 */
export const CreateVendorInputSchema = VendorSchema.omit({ id: true })

/**
 * UpdateVendorInput Schema（所有字段可选）
 */
export const UpdateVendorInputSchema = VendorSchema.omit({ id: true }).partial()

/**
 * 类型导出（从 Schema 推导）
 */
export type VendorSchemaType = z.infer<typeof VendorSchema>
export type CreateVendorInputSchemaType = z.infer<
  typeof CreateVendorInputSchema
>
export type UpdateVendorInputSchemaType = z.infer<
  typeof UpdateVendorInputSchema
>
