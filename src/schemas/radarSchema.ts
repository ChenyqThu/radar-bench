/**
 * RadarChart 数据验证 Schema
 */

import { z } from 'zod'
import { MAX_NAME_LENGTH } from '@/lib/constants'
import { VendorSchema } from './vendorSchema'
import { DimensionSchema } from './dimensionSchema'

/**
 * RadarChart Schema
 */
export const RadarChartSchema = z.object({
  id: z.string().min(1, 'ID 不能为空'),
  name: z
    .string()
    .min(1, '名称不能为空')
    .max(MAX_NAME_LENGTH, `名称长度不能超过 ${MAX_NAME_LENGTH} 个字符`),
  createdAt: z.date(),
  updatedAt: z.date(),
  vendors: z.array(VendorSchema),
  dimensions: z.array(DimensionSchema),
})

/**
 * CreateRadarChartInput Schema
 */
export const CreateRadarChartInputSchema = z.object({
  name: z
    .string()
    .min(1, '名称不能为空')
    .max(MAX_NAME_LENGTH, `名称长度不能超过 ${MAX_NAME_LENGTH} 个字符`),
  vendors: z.array(VendorSchema).optional(),
  dimensions: z.array(DimensionSchema).optional(),
})

/**
 * UpdateRadarChartInput Schema
 */
export const UpdateRadarChartInputSchema = z
  .object({
    name: z
      .string()
      .min(1, '名称不能为空')
      .max(MAX_NAME_LENGTH, `名称长度不能超过 ${MAX_NAME_LENGTH} 个字符`)
      .optional(),
    vendors: z.array(VendorSchema).optional(),
    dimensions: z.array(DimensionSchema).optional(),
  })
  .partial()

/**
 * 类型导出（从 Schema 推导）
 */
export type RadarChartSchemaType = z.infer<typeof RadarChartSchema>
export type CreateRadarChartInputSchemaType = z.infer<
  typeof CreateRadarChartInputSchema
>
export type UpdateRadarChartInputSchemaType = z.infer<
  typeof UpdateRadarChartInputSchema
>
