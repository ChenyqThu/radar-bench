/**
 * 子维度行组件
 * 嵌套在父维度下，支持编辑权重和分数
 * 支持拖拽排序
 */

import { useState } from 'react'
import type { SubDimension, Vendor } from '@/types'
import { TableCell, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScoreInputCell } from './ScoreInputCell'
import { GripVertical, Trash2, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export interface SubDimensionRowProps {
  /** 子维度数据 */
  subDimension: SubDimension
  /** 竞品列表 */
  vendors: Vendor[]
  /** 父维度 ID */
  parentDimensionId: string
  /** 是否可拖拽 */
  draggable?: boolean
  /** 更新子维度回调 */
  onUpdate: (subDimensionId: string, updates: Partial<SubDimension>) => void
  /** 更新分数回调 */
  onUpdateScore: (
    subDimensionId: string,
    vendorId: string,
    score: number
  ) => void
  /** 删除子维度回调 */
  onDelete: (subDimensionId: string) => void
}

/**
 * 子维度行组件
 */
export function SubDimensionRow({
  subDimension,
  vendors,
  draggable = false,
  onUpdate,
  onUpdateScore,
  onDelete,
}: SubDimensionRowProps) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [editName, setEditName] = useState(subDimension.name)
  const [isEditingWeight, setIsEditingWeight] = useState(false)
  const [editWeight, setEditWeight] = useState(String(subDimension.weight))

  // 拖拽功能
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: subDimension.id,
    disabled: !draggable,
  })

  const style = draggable
    ? {
        transform: CSS.Transform.toString(transform),
        transition,
      }
    : undefined

  const handleSaveName = () => {
    if (editName.trim()) {
      onUpdate(subDimension.id, { name: editName.trim() })
      setIsEditingName(false)
    }
  }

  const handleCancelName = () => {
    setEditName(subDimension.name)
    setIsEditingName(false)
  }

  const handleSaveWeight = () => {
    const weight = parseFloat(editWeight)
    if (!isNaN(weight) && weight >= 0 && weight <= 100) {
      onUpdate(subDimension.id, { weight })
      setIsEditingWeight(false)
    }
  }

  const handleCancelWeight = () => {
    setEditWeight(String(subDimension.weight))
    setIsEditingWeight(false)
  }

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-muted/30 hover:bg-muted/50',
        isDragging && 'opacity-50'
      )}
    >
      {/* 拖拽手柄 */}
      <TableCell className="w-12 px-2">
        {draggable && (
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </TableCell>

      {/* 子维度名称 (缩进) */}
      <TableCell className="font-medium">
        <div className="flex items-center gap-2 pl-12">
          <span className="text-muted-foreground">└</span>
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
            <span
              className="cursor-pointer text-sm hover:underline"
              onClick={() => setIsEditingName(true)}
            >
              {subDimension.name}
            </span>
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
            className="cursor-pointer text-sm hover:underline"
            onClick={() => setIsEditingWeight(true)}
          >
            {subDimension.weight}%
          </span>
        )}
      </TableCell>

      {/* 各竞品分数 */}
      {vendors.map((vendor) => (
        <TableCell key={vendor.id} className="w-24">
          <ScoreInputCell
            value={subDimension.scores[vendor.id] || 0}
            onChange={(score) =>
              onUpdateScore(subDimension.id, vendor.id, score)
            }
          />
        </TableCell>
      ))}

      {/* 操作 */}
      <TableCell className="w-24">
        <Button
          size="icon"
          variant="ghost"
          className="opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => onDelete(subDimension.id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </TableCell>
    </TableRow>
  )
}
