/**
 * 竞品系列项组件
 * 支持内联编辑、颜色选择、标记类型选择
 */

import React, { useState } from 'react'
import type { Vendor, SymbolType } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ColorPicker } from './ColorPicker'
import { GripVertical, Trash2, Check, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export interface VendorItemProps {
  /** 竞品数据 */
  vendor: Vendor
  /** 是否正在编辑 */
  isEditing: boolean
  /** 开始编辑回调 */
  onEdit: () => void
  /** 保存更新回调 */
  onUpdate: (updates: Partial<Vendor>) => void
  /** 删除回调 */
  onDelete: () => void
  /** 是否可拖拽 */
  draggable?: boolean
}

/**
 * 竞品系列项组件
 */
export function VendorItem({
  vendor,
  isEditing,
  onEdit,
  onUpdate,
  onDelete,
  draggable = false,
}: VendorItemProps) {
  const { t } = useTranslation()
  const [editName, setEditName] = useState(vendor.name)
  const [editColor, setEditColor] = useState(vendor.color)
  const [editSymbol, setEditSymbol] = useState(vendor.symbol)

  const handleSave = () => {
    if (editName.trim()) {
      onUpdate({
        name: editName.trim(),
        color: editColor,
        symbol: editSymbol,
      })
    }
  }

  const handleCancel = () => {
    setEditName(vendor.name)
    setEditColor(vendor.color)
    setEditSymbol(vendor.symbol)
    onEdit()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
        {draggable && (
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        )}
        <Input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
          placeholder={t('vendors.namePlaceholder')}
          autoFocus
          maxLength={50}
        />
        <ColorPicker color={editColor} onChange={setEditColor} />
        <Select
          value={editSymbol}
          onValueChange={(value) => setEditSymbol(value as SymbolType)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="circle">
              {t('vendors.symbols.circle')}
            </SelectItem>
            <SelectItem value="rect">{t('vendors.symbols.rect')}</SelectItem>
            <SelectItem value="triangle">
              {t('vendors.symbols.triangle')}
            </SelectItem>
            <SelectItem value="diamond">
              {t('vendors.symbols.diamond')}
            </SelectItem>
          </SelectContent>
        </Select>
        <Button size="icon" variant="ghost" onClick={handleSave}>
          <Check className="h-4 w-4 text-green-600" />
        </Button>
        <Button size="icon" variant="ghost" onClick={handleCancel}>
          <X className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    )
  }

  return (
    <div
      data-testid="vendor-item"
      className={cn(
        'group flex items-center gap-3 rounded-lg border bg-card p-3 transition-all',
        'hover:bg-muted/50'
      )}
      onClick={onEdit}
    >
      {draggable && (
        <GripVertical className="h-5 w-5 cursor-grab opacity-0 text-muted-foreground transition-opacity group-hover:opacity-100 active:cursor-grabbing" />
      )}
      <div
        className="h-4 w-4 flex-shrink-0 rounded-full border"
        style={{ backgroundColor: vendor.color }}
      />
      <span className="flex-1 font-medium">{vendor.name}</span>
      <span className="text-sm text-muted-foreground">
        {t(`vendors.symbols.${vendor.symbol}`)}
      </span>
      <Button
        size="icon"
        variant="ghost"
        className="opacity-0 transition-opacity group-hover:opacity-100"
        aria-label={t('common.delete')}
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  )
}

// 使用 React.memo 优化性能
export default React.memo(VendorItem)
