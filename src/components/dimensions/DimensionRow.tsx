/**
 * 维度行组件
 * 显示单个维度的信息和分数输入，支持子维度展开和拖拽排序
 */

import React, { useState } from 'react'
import type { Dimension, Vendor } from '@/types'
import { TableCell, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScoreInputCell } from './ScoreInputCell'
import { SubDimensionRow } from './SubDimensionRow'
import {
  GripVertical,
  ChevronDown,
  ChevronRight,
  Trash2,
  Check,
  X,
  Plus,
  AlertCircle,
  CheckCircle,
  Calculator,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { shouldAutoCalculate } from '@/lib/calculations'
import { validateSubDimensionsWeight } from '@/lib/validators'
import { useAutoCalculate } from '@/hooks/useAutoCalculate'
import { useTranslation } from 'react-i18next'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDragAndDrop } from '@/hooks/useDragAndDrop'

export interface DimensionRowProps {
  /** 维度数据 */
  dimension: Dimension
  /** 竞品列表 */
  vendors: Vendor[]
  /** 是否展开子维度 */
  isExpanded?: boolean
  /** 是否可拖拽 */
  draggable?: boolean
  /** 切换展开/收起回调 */
  onToggleExpand?: () => void
  /** 查看子维度雷达图回调 */
  onViewSubRadar?: (dimensionId: string) => void
  /** 更新维度回调 */
  onUpdate: (dimensionId: string, updates: Partial<Dimension>) => void
  /** 更新分数回调 */
  onUpdateScore: (dimensionId: string, vendorId: string, score: number) => void
  /** 删除维度回调 */
  onDelete: (dimensionId: string) => void
  /** 添加子维度回调 */
  onAddSubDimension?: (dimensionId: string) => void
  /** 更新子维度回调 */
  onUpdateSubDimension?: (
    dimensionId: string,
    subDimensionId: string,
    updates: Partial<Dimension>
  ) => void
  /** 更新子维度分数回调 */
  onUpdateSubDimensionScore?: (
    dimensionId: string,
    subDimensionId: string,
    vendorId: string,
    score: number
  ) => void
  /** 删除子维度回调 */
  onDeleteSubDimension?: (dimensionId: string, subDimensionId: string) => void
  /** 重新排序子维度回调 */
  onReorderSubDimensions?: (
    dimensionId: string,
    subDimensionIds: string[]
  ) => void
}

/**
 * 维度行组件
 */
export function DimensionRow({
  dimension,
  vendors,
  isExpanded = false,
  draggable = false,
  onToggleExpand,
  onViewSubRadar,
  onUpdate,
  onUpdateScore,
  onDelete,
  onAddSubDimension,
  onUpdateSubDimension,
  onUpdateSubDimensionScore,
  onDeleteSubDimension,
  onReorderSubDimensions,
}: DimensionRowProps) {
  const { t } = useTranslation()
  const [isEditingName, setIsEditingName] = useState(false)
  const [editName, setEditName] = useState(dimension.name)
  const [isEditingWeight, setIsEditingWeight] = useState(false)
  const [editWeight, setEditWeight] = useState(String(dimension.weight))

  const hasSubDimensions =
    dimension.subDimensions && dimension.subDimensions.length > 0
  const autoCalculate = shouldAutoCalculate(dimension)

  // 拖拽功能
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: dimension.id,
    disabled: !draggable,
  })

  const style = draggable
    ? {
        transform: CSS.Transform.toString(transform),
        transition,
      }
    : undefined

  // 自动计算父维度分数
  useAutoCalculate(dimension, vendors, onUpdate)

  // 子维度权重验证
  const subWeightValidation = hasSubDimensions
    ? validateSubDimensionsWeight(
        dimension.subDimensions!,
        dimension.id,
        dimension.name
      )
    : { isValid: true, total: 0, error: null }

  const handleSaveName = () => {
    if (editName.trim()) {
      onUpdate(dimension.id, { name: editName.trim() })
      setIsEditingName(false)
    }
  }

  const handleCancelName = () => {
    setEditName(dimension.name)
    setIsEditingName(false)
  }

  const handleSaveWeight = () => {
    const weight = parseFloat(editWeight)
    if (!isNaN(weight) && weight >= 0 && weight <= 100) {
      onUpdate(dimension.id, { weight })
      setIsEditingWeight(false)
    }
  }

  const handleCancelWeight = () => {
    setEditWeight(String(dimension.weight))
    setIsEditingWeight(false)
  }

  // 按 order 排序子维度
  const sortedSubDimensions = hasSubDimensions
    ? [...dimension.subDimensions!].sort((a, b) => a.order - b.order)
    : []

  // 子维度拖拽处理
  const {
    handleDragStart: handleSubDragStart,
    handleDragEnd: handleSubDragEnd,
    handleDragCancel: handleSubDragCancel,
  } = useDragAndDrop({
    onReorder: (activeId, overId) => {
      if (!onReorderSubDimensions) return

      const oldIndex = sortedSubDimensions.findIndex((s) => s.id === activeId)
      const newIndex = sortedSubDimensions.findIndex((s) => s.id === overId)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newSubDimensions = [...sortedSubDimensions]
        const [movedSub] = newSubDimensions.splice(oldIndex, 1)
        newSubDimensions.splice(newIndex, 0, movedSub)
        onReorderSubDimensions(
          dimension.id,
          newSubDimensions.map((s) => s.id)
        )
      }
    },
  })

  return (
    <>
      <TableRow
        data-testid="dimension-row"
        ref={setNodeRef}
        style={style}
        className={cn('group hover:bg-muted/50', isDragging && 'opacity-50')}
      >
        {/* 拖拽手柄 */}
        <TableCell className="w-12 px-2">
          {draggable && (
            <div
              {...attributes}
              {...listeners}
              tabIndex={-1}
              className="cursor-grab opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
            >
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </TableCell>

        {/* 维度名称 */}
        <TableCell className="font-medium">
          <div className="flex items-center gap-2">
            {hasSubDimensions && onToggleExpand && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 flex-shrink-0"
                onClick={onToggleExpand}
                aria-label={
                  isExpanded ? t('common.collapse') : t('common.expand')
                }
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
            {isEditingName ? (
              <div className="flex items-center gap-1">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName()
                    else if (e.key === 'Escape') handleCancelName()
                  }}
                  className="h-8"
                  autoFocus
                  maxLength={100}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={handleSaveName}
                >
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={handleCancelName}
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span
                  className="cursor-pointer hover:underline"
                  onClick={() => setIsEditingName(true)}
                >
                  {dimension.name}
                </span>
                {autoCalculate && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Calculator className="h-4 w-4 text-blue-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('dimensions.autoCalculated')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )}
          </div>
        </TableCell>

        {/* 权重 */}
        <TableCell className="w-24">
          {isEditingWeight ? (
            <div className="flex items-center gap-1">
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={editWeight}
                onChange={(e) => setEditWeight(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveWeight()
                  else if (e.key === 'Escape') handleCancelWeight()
                }}
                className="h-8 w-20 text-center"
                autoFocus
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={handleSaveWeight}
              >
                <Check className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={handleCancelWeight}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ) : (
            <span
              className="cursor-pointer hover:underline"
              onClick={() => setIsEditingWeight(true)}
            >
              {dimension.weight}%
            </span>
          )}
        </TableCell>

        {/* 各竞品分数 */}
        {vendors.map((vendor) => (
          <TableCell key={vendor.id} className="w-24">
            <ScoreInputCell
              value={dimension.scores[vendor.id] || 0}
              onChange={(score) =>
                onUpdateScore(dimension.id, vendor.id, score)
              }
              readOnly={autoCalculate}
            />
          </TableCell>
        ))}

        {/* 操作 */}
        <TableCell className="w-32">
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            {onAddSubDimension && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      tabIndex={-1}
                      onClick={() => onAddSubDimension(dimension.id)}
                    >
                      <Plus className="h-4 w-4 text-green-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('dimensions.addSubDimension')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {hasSubDimensions && onViewSubRadar && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      tabIndex={-1}
                      onClick={() => onViewSubRadar(dimension.id)}
                    >
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('dimensions.viewSubRadar')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <Button
              size="icon"
              variant="ghost"
              tabIndex={-1}
              onClick={() => onDelete(dimension.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {/* 子维度展开区域 */}
      {isExpanded && hasSubDimensions && (
        <>
          {/* 子维度权重验证提示 */}
          {!subWeightValidation.isValid && (
            <TableRow>
              <TableCell colSpan={3 + vendors.length + 1}>
                <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800 dark:text-amber-200">
                    {subWeightValidation.error?.message}
                  </AlertDescription>
                </Alert>
              </TableCell>
            </TableRow>
          )}

          {subWeightValidation.isValid && (
            <TableRow>
              <TableCell colSpan={3 + vendors.length + 1}>
                <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    {t('validation.subWeightValid')}
                  </AlertDescription>
                </Alert>
              </TableCell>
            </TableRow>
          )}

          {/* 子维度行 (支持拖拽排序) */}
          <DndContext
            collisionDetection={closestCenter}
            onDragStart={handleSubDragStart}
            onDragEnd={handleSubDragEnd}
            onDragCancel={handleSubDragCancel}
          >
            <SortableContext
              items={sortedSubDimensions.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {sortedSubDimensions.map((subDimension) => (
                <SubDimensionRow
                  key={subDimension.id}
                  subDimension={subDimension}
                  vendors={vendors}
                  parentDimensionId={dimension.id}
                  draggable
                  onUpdate={(subId, updates) =>
                    onUpdateSubDimension?.(dimension.id, subId, updates)
                  }
                  onUpdateScore={(subId, vendorId, score) =>
                    onUpdateSubDimensionScore?.(
                      dimension.id,
                      subId,
                      vendorId,
                      score
                    )
                  }
                  onDelete={(subId) =>
                    onDeleteSubDimension?.(dimension.id, subId)
                  }
                />
              ))}
            </SortableContext>
          </DndContext>

          {/* 添加子维度按钮 */}
          {onAddSubDimension && (
            <TableRow>
              <TableCell colSpan={3 + vendors.length + 1} className="py-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-12 gap-2"
                  onClick={() => onAddSubDimension(dimension.id)}
                >
                  <Plus className="h-4 w-4" />
                  {t('dimensions.addSubDimension')}
                </Button>
              </TableCell>
            </TableRow>
          )}
        </>
      )}
    </>
  )
}

// 使用 React.memo 优化性能
export default React.memo(DimensionRow)
