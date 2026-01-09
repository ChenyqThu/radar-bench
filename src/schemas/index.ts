/**
 * Schema 统一导出
 */

// Vendor Schema
export {
  SymbolTypeSchema,
  VendorSchema,
  CreateVendorInputSchema,
  UpdateVendorInputSchema,
  type VendorSchemaType,
  type CreateVendorInputSchemaType,
  type UpdateVendorInputSchemaType,
} from './vendorSchema'

// Dimension Schema
export {
  ScoreRecordSchema,
  SubDimensionSchema,
  DimensionSchema,
  CreateSubDimensionInputSchema,
  UpdateSubDimensionInputSchema,
  CreateDimensionInputSchema,
  UpdateDimensionInputSchema,
  type SubDimensionSchemaType,
  type DimensionSchemaType,
  type CreateSubDimensionInputSchemaType,
  type UpdateSubDimensionInputSchemaType,
  type CreateDimensionInputSchemaType,
  type UpdateDimensionInputSchemaType,
} from './dimensionSchema'

// RadarChart Schema
export {
  RadarChartSchema,
  CreateRadarChartInputSchema,
  UpdateRadarChartInputSchema,
  type RadarChartSchemaType,
  type CreateRadarChartInputSchemaType,
  type UpdateRadarChartInputSchemaType,
} from './radarSchema'
