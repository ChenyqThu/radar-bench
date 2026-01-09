/**
 * 维度管理表格组件
 * 显示所有维度、权重、分数输入
 * 支持拖拽排序
 */

import React, { useState } from 'react'
import { useRadarStore } from '@/store/radarStore'
import { useWeightValidation } from '@/hooks/useWeightValidation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { DimensionRow } from './DimensionRow'
import { Plus, AlertCircle, CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDragAndDrop } from '@/hooks/useDragAndDrop'

/**
 * 维度管理表格组件 Props
 */
export interface DimensionTableProps {
  /** 查看子维度雷达图回调 */
  onViewSubRadar?: (dimensionId: string) => void
}

/**
 * 维度管理表格组件
 */
export function DimensionTable({ onViewSubRadar }: DimensionTableProps = {}) {
  const { t } = useTranslation()
  const {
    getActiveChart,
    addDimension,
    updateDimension,
    deleteDimension,
    updateDimensionScore,
    addSubDimension,
    updateSubDimension,
    deleteSubDimension,
    updateSubDimensionScore,
    reorderDimensions,
    reorderSubDimensions,
  } = useRadarStore()
  const activeChart = getActiveChart()
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [dimensionToDelete, setDimensionToDelete] = useState<string | null>(
    null
  )

  // 权重验证 (使用 Hook) - 必须在 early return 之前调用
  const weightValidation = useWeightValidation(activeChart?.dimensions || [])

  // 拖拽处理 - 必须在 early return 之前调用
  const { handleDragStart, handleDragEnd, handleDragCancel } = useDragAndDrop({
    onReorder: (activeId, overId) => {
      if (!activeChart) return

      const sortedDimensions = [...activeChart.dimensions].sort(
        (a, b) => a.order - b.order
      )
      const oldIndex = sortedDimensions.findIndex((d) => d.id === activeId)
      const newIndex = sortedDimensions.findIndex((d) => d.id === overId)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newDimensions = [...sortedDimensions]
        const [movedDimension] = newDimensions.splice(oldIndex, 1)
        newDimensions.splice(newIndex, 0, movedDimension)
        reorderDimensions(
          activeChart.id,
          newDimensions.map((d) => d.id)
        )
      }
    },
  })

  if (!activeChart) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">{t('dimensions.noActiveChart')}</p>
      </Card>
    )
  }

  const handleAddDimension = () => {
    const dimensionCount = activeChart.dimensions.length
    addDimension(activeChart.id, {
      name: t('dimensions.newDimension', { number: dimensionCount + 1 }),
      description: '',
      weight: 0,
      order: dimensionCount,
      scores: {},
      subDimensions: [],
    })
  }

  const handleToggleExpand = (dimensionId: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(dimensionId)) {
        newSet.delete(dimensionId)
      } else {
        newSet.add(dimensionId)
      }
      return newSet
    })
  }

  const handleUpdateDimension = (
    dimensionId: string,
    updates: Partial<(typeof activeChart.dimensions)[0]>
  ) => {
    updateDimension(activeChart.id, dimensionId, updates)
  }

  const handleUpdateScore = (
    dimensionId: string,
    vendorId: string,
    score: number
  ) => {
    updateDimensionScore(activeChart.id, dimensionId, vendorId, score)
  }

  const handleDeleteDimension = (dimensionId: string) => {
    // 至少保留一个维度
    if (activeChart.dimensions.length > 1) {
      setDimensionToDelete(dimensionId)
      setDeleteDialogOpen(true)
    }
  }

  const confirmDelete = () => {
    if (dimensionToDelete && activeChart) {
      deleteDimension(activeChart.id, dimensionToDelete)
      setDimensionToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  // 子维度管理
  const handleAddSubDimension = (dimensionId: string) => {
    const dimension = activeChart.dimensions.find((d) => d.id === dimensionId)
    if (!dimension) return

    const subDimensionCount = dimension.subDimensions?.length || 0
    addSubDimension(activeChart.id, dimensionId, {
      name: t('dimensions.newSubDimension', { number: subDimensionCount + 1 }),
      description: '',
      weight: 0,
      order: subDimensionCount,
      scores: {},
    })
  }

  const handleUpdateSubDimension = (
    dimensionId: string,
    subDimensionId: string,
    updates: Partial<(typeof activeChart.dimensions)[0]>
  ) => {
    updateSubDimension(activeChart.id, dimensionId, subDimensionId, updates)
  }

  const handleUpdateSubDimensionScore = (
    dimensionId: string,
    subDimensionId: string,
    vendorId: string,
    score: number
  ) => {
    updateSubDimensionScore(
      activeChart.id,
      dimensionId,
      subDimensionId,
      vendorId,
      score
    )
  }

  const handleDeleteSubDimension = (
    dimensionId: string,
    subDimensionId: string
  ) => {
    deleteSubDimension(activeChart.id, dimensionId, subDimensionId)
  }

  const handleReorderSubDimensions = (
    dimensionId: string,
    subDimensionIds: string[]
  ) => {
    reorderSubDimensions(activeChart.id, dimensionId, subDimensionIds)
  }

  // 按 order 排序
  const sortedDimensions = [...activeChart.dimensions].sort(
    (a, b) => a.order - b.order
  )
  const sortedVendors = [...activeChart.vendors].sort(
    (a, b) => a.order - b.order
  )

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t('dimensions.title')}</h3>
        <Button onClick={handleAddDimension} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          {t('dimensions.add')}
        </Button>
      </div>

      {/* 权重验证提示 */}
      {!weightValidation.isValid && (
        <Alert className="mb-4 border-amber-500 bg-amber-50 dark:bg-amber-950">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            {t('validation.weightInvalid', {
              total: weightValidation.dimensionTotal.toFixed(1),
            })}
            {weightValidation.subDimensionErrors.length > 0 && (
              <div className="mt-2 space-y-1">
                {weightValidation.subDimensionErrors.map((error, idx) => (
                  <div key={idx} className="text-sm">
                    • {error.message}
                  </div>
                ))}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {weightValidation.isValid && activeChart.dimensions.length > 0 && (
        <Alert className="mb-4 border-green-500 bg-green-50 dark:bg-green-950">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            {t('validation.weightValid')}
          </AlertDescription>
        </Alert>
      )}

      {activeChart.dimensions.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          <p>{t('dimensions.empty')}</p>
          <Button
            onClick={handleAddDimension}
            variant="outline"
            className="mt-4"
          >
            {t('dimensions.addFirst')}
          </Button>
        </div>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>{t('dimensions.name')}</TableHead>
                  <TableHead className="w-24">
                    {t('dimensions.weight')}
                  </TableHead>
                  {sortedVendors.map((vendor) => (
                    <TableHead key={vendor.id} className="w-24 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: vendor.color }}
                        />
                        <span className="truncate">{vendor.name}</span>
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="w-24">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SortableContext
                  items={sortedDimensions.map((d) => d.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {sortedDimensions.map((dimension) => (
                    <DimensionRow
                      key={dimension.id}
                      dimension={dimension}
                      vendors={sortedVendors}
                      isExpanded={expandedIds.has(dimension.id)}
                      draggable
                      onToggleExpand={() => handleToggleExpand(dimension.id)}
                      onViewSubRadar={onViewSubRadar}
                      onUpdate={handleUpdateDimension}
                      onUpdateScore={handleUpdateScore}
                      onDelete={handleDeleteDimension}
                      onAddSubDimension={handleAddSubDimension}
                      onUpdateSubDimension={handleUpdateSubDimension}
                      onUpdateSubDimensionScore={handleUpdateSubDimensionScore}
                      onDeleteSubDimension={handleDeleteSubDimension}
                      onReorderSubDimensions={handleReorderSubDimensions}
                    />
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          </div>
        </DndContext>
      )}

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dimensions.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dimensions.deleteDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive"
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

// 使用 React.memo 优化性能
export default React.memo(DimensionTable)
