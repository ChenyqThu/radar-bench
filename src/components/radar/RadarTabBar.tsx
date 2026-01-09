/**
 * 雷达图 Tab 导航栏
 * 支持切换、新增、重命名、删除、复制雷达图
 * 支持拖拽排序
 */

import React, { useState } from 'react'
import { useRadarStore } from '@/store/radarStore'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreateRadarDialog } from './CreateRadarDialog'
import { MoreVertical, Copy, Edit2, Trash2, GripVertical } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDragAndDrop } from '@/hooks/useDragAndDrop'

/**
 * 可排序的 Tab 项组件
 */
interface SortableTabItemProps {
  chartId: string
  chartName: string
  radarChartsLength: number
  onRename: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

function SortableTabItem({
  chartId,
  chartName,
  radarChartsLength,
  onRename,
  onDuplicate,
  onDelete,
}: SortableTabItemProps) {
  const { t } = useTranslation()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chartId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative flex items-center"
    >
      {/* 拖拽手柄 */}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          'flex h-10 w-6 cursor-grab items-center justify-center',
          'opacity-0 transition-opacity group-hover:opacity-100',
          'active:cursor-grabbing'
        )}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <TabsTrigger
        value={chartId}
        className={cn(
          'relative rounded-t-lg border-b-2 border-transparent px-4',
          'data-[state=active]:border-primary data-[state=active]:bg-muted/50'
        )}
      >
        <span className="max-w-[150px] truncate">{chartName}</span>
      </TabsTrigger>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'absolute -right-2 top-1/2 h-6 w-6 -translate-y-1/2',
              'opacity-0 transition-opacity group-hover:opacity-100'
            )}
          >
            <MoreVertical className="h-3 w-3" />
            <span className="sr-only">{t('common.more')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onRename(chartId)}>
            <Edit2 className="mr-2 h-4 w-4" />
            {t('radar.rename')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDuplicate(chartId)}>
            <Copy className="mr-2 h-4 w-4" />
            {t('radar.duplicate')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDelete(chartId)}
            className="text-destructive"
            disabled={radarChartsLength === 1}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t('radar.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

/**
 * 雷达图 Tab 导航栏
 */
export function RadarTabBar() {
  const { t } = useTranslation()
  const {
    radarCharts,
    activeChartId,
    setActiveChart,
    deleteRadarChart,
    renameRadarChart,
    duplicateRadarChart,
    reorderCharts,
  } = useRadarStore()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [chartToDelete, setChartToDelete] = useState<string | null>(null)
  const [chartToRename, setChartToRename] = useState<string | null>(null)
  const [newName, setNewName] = useState('')

  // 按 order 排序
  const sortedCharts = [...radarCharts].sort((a, b) => a.order - b.order)

  // 拖拽处理
  const { activeId, handleDragStart, handleDragEnd, handleDragCancel } =
    useDragAndDrop({
      onReorder: (activeId, overId) => {
        const oldIndex = sortedCharts.findIndex((c) => c.id === activeId)
        const newIndex = sortedCharts.findIndex((c) => c.id === overId)

        if (oldIndex !== -1 && newIndex !== -1) {
          const newCharts = [...sortedCharts]
          const [movedChart] = newCharts.splice(oldIndex, 1)
          newCharts.splice(newIndex, 0, movedChart)
          reorderCharts(newCharts.map((c) => c.id))
        }
      },
    })

  const activeChart = sortedCharts.find((c) => c.id === activeId)

  const handleDelete = (chartId: string) => {
    setChartToDelete(chartId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (chartToDelete) {
      deleteRadarChart(chartToDelete)
      setChartToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleRename = (chartId: string) => {
    const chart = radarCharts.find((c) => c.id === chartId)
    if (chart) {
      setChartToRename(chartId)
      setNewName(chart.name)
      setRenameDialogOpen(true)
    }
  }

  const confirmRename = () => {
    if (chartToRename && newName.trim()) {
      renameRadarChart(chartToRename, newName.trim())
      setChartToRename(null)
      setNewName('')
      setRenameDialogOpen(false)
    }
  }

  const handleDuplicate = (chartId: string) => {
    const newId = duplicateRadarChart(chartId)
    if (newId) {
      setActiveChart(newId)
    }
  }

  if (radarCharts.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <p className="mb-4 text-muted-foreground">{t('radar.noCharts')}</p>
          <CreateRadarDialog />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center gap-2 border-b">
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <Tabs
            value={activeChartId || undefined}
            onValueChange={setActiveChart}
            className="flex-1"
          >
            <TabsList className="h-12 w-full justify-start rounded-none border-b-0 bg-transparent p-0">
              <SortableContext
                items={sortedCharts.map((c) => c.id)}
                strategy={horizontalListSortingStrategy}
              >
                {sortedCharts.map((chart) => (
                  <SortableTabItem
                    key={chart.id}
                    chartId={chart.id}
                    chartName={chart.name}
                    radarChartsLength={radarCharts.length}
                    onRename={handleRename}
                    onDuplicate={handleDuplicate}
                    onDelete={handleDelete}
                  />
                ))}
              </SortableContext>
            </TabsList>
          </Tabs>

          {/* 拖拽预览 */}
          <DragOverlay>
            {activeChart && (
              <div className="rounded-t-lg bg-muted/80 px-4 py-2">
                <span className="max-w-[150px] truncate">
                  {activeChart.name}
                </span>
              </div>
            )}
          </DragOverlay>
        </DndContext>

        <CreateRadarDialog />
      </div>

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('radar.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('radar.deleteDescription')}
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

      {/* 重命名对话框 */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('radar.renameTitle')}</DialogTitle>
            <DialogDescription>
              {t('radar.renameDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-name">{t('radar.name')}</Label>
              <Input
                id="new-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newName.trim()) {
                    confirmRename()
                  }
                }}
                autoFocus
                maxLength={100}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRenameDialogOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="button"
              onClick={confirmRename}
              disabled={!newName.trim()}
            >
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// 使用 React.memo 优化性能
export default React.memo(RadarTabBar)
