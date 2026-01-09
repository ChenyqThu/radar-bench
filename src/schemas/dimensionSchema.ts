/**
 * Dimension 和 SubDimension 数据验证 Schema
 */

import { z } from 'zod'
import {
  MAX_NAME_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  SCORE_MIN,
  SCORE_MAX,
  WEIGHT_MIN,
  WEIGHT_MAX,
} from '@/lib/constants'

/**
 * ScoreRecord Schema
 * Key: Vendor ID (string)
 * Value: Score (0-10 整数)
 */
export const ScoreRecordSchema = z.record(
  z.string(),
  z
    .number()
    .int('分数必须为整数')
    .min(SCORE_MIN, `分数不能小于 ${SCORE_MIN}`)
    .max(SCORE_MAX, `分数不能大于 ${SCORE_MAX}`)
)

/**
 * SubDimension Schema
 */
export const SubDimensionSchema = z.object({
  id: z.string().min(1, 'ID 不能为空'),
  name: z
    .string()
    .min(1, '名称不能为空')
    .max(MAX_NAME_LENGTH, `名称长度不能超过 ${MAX_NAME_LENGTH} 个字符`),
  description: z
    .string()
    .max(
      MAX_DESCRIPTION_LENGTH,
      `描述长度不能超过 ${MAX_DESCRIPTION_LENGTH} 个字符`
    )
    .optional(),
  weight: z
    .number()
    .min(WEIGHT_MIN, `权重不能小于 ${WEIGHT_MIN}`)
    .max(WEIGHT_MAX, `权重不能大于 ${WEIGHT_MAX}`),
  order: z.number().int('排序序号必须为整数').min(0, '排序序号不能为负数'),
  scores: ScoreRecordSchema,
})

/**
 * Dimension Schema
 */
export const DimensionSchema = z.object({
  id: z.string().min(1, 'ID 不能为空'),
  name: z
    .string()
    .min(1, '名称不能为空')
    .max(MAX_NAME_LENGTH, `名称长度不能超过 ${MAX_NAME_LENGTH} 个字符`),
  description: z
    .string()
    .max(
      MAX_DESCRIPTION_LENGTH,
      `描述长度不能超过 ${MAX_DESCRIPTION_LENGTH} 个字符`
    )
    .optional(),
  weight: z
    .number()
    .min(WEIGHT_MIN, `权重不能小于 ${WEIGHT_MIN}`)
    .max(WEIGHT_MAX, `权重不能大于 ${WEIGHT_MAX}`),
  order: z.number().int('排序序号必须为整数').min(0, '排序序号不能为负数'),
  scores: ScoreRecordSchema,
  subDimensions: z.array(SubDimensionSchema).optional(),
})

/**
 * CreateSubDimensionInput Schema
 */
export const CreateSubDimensionInputSchema = SubDimensionSchema.omit({
  id: true,
})

/**
 * UpdateSubDimensionInput Schema
 */
export const UpdateSubDimensionInputSchema = SubDimensionSchema.omit({
  id: true,
}).partial()

/**
 * CreateDimensionInput Schema
 */
export const CreateDimensionInputSchema = DimensionSchema.omit({ id: true })

/**
 * UpdateDimensionInput Schema
 */
export const UpdateDimensionInputSchema = DimensionSchema.omit({
  id: true,
}).partial()

/**
 * 类型导出（从 Schema 推导）
 */
export type SubDimensionSchemaType = z.infer<typeof SubDimensionSchema>
export type DimensionSchemaType = z.infer<typeof DimensionSchema>
export type CreateSubDimensionInputSchemaType = z.infer<
  typeof CreateSubDimensionInputSchema
>
export type UpdateSubDimensionInputSchemaType = z.infer<
  typeof UpdateSubDimensionInputSchema
>
export type CreateDimensionInputSchemaType = z.infer<
  typeof CreateDimensionInputSchema
>
export type UpdateDimensionInputSchemaType = z.infer<
  typeof UpdateDimensionInputSchema
>
