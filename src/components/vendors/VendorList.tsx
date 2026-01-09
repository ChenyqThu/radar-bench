/**
 * 竞品系列列表组件
 * 支持拖拽排序
 */

import React, { useState } from 'react'
import type { Vendor } from '@/types'
import { VendorItem } from './VendorItem'
import { SortableVendorItem } from './SortableVendorItem'
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDragAndDrop } from '@/hooks/useDragAndDrop'

export interface VendorListProps {
  /** 竞品列表 */
  vendors: Vendor[]
  /** 更新竞品回调 */
  onUpdate: (vendorId: string, updates: Partial<Vendor>) => void
  /** 删除竞品回调 */
  onDelete: (vendorId: string) => void
  /** 重新排序回调 */
  onReorder: (vendorIds: string[]) => void
}

/**
 * 竞品系列列表组件
 */
export function VendorList({
  vendors,
  onUpdate,
  onDelete,
  onReorder,
}: VendorListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleUpdate = (vendorId: string, updates: Partial<Vendor>) => {
    onUpdate(vendorId, updates)
    setEditingId(null)
  }

  // 按 order 排序
  const sortedVendors = [...vendors].sort((a, b) => a.order - b.order)

  // 拖拽处理
  const { activeId, handleDragStart, handleDragEnd, handleDragCancel } =
    useDragAndDrop({
      onReorder: (activeId, overId) => {
        const oldIndex = sortedVendors.findIndex((v) => v.id === activeId)
        const newIndex = sortedVendors.findIndex((v) => v.id === overId)

        if (oldIndex !== -1 && newIndex !== -1) {
          const newVendors = [...sortedVendors]
          const [movedVendor] = newVendors.splice(oldIndex, 1)
          newVendors.splice(newIndex, 0, movedVendor)
          onReorder(newVendors.map((v) => v.id))
        }
      },
    })

  const activeVendor = sortedVendors.find((v) => v.id === activeId)

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="space-y-2">
        <SortableContext
          items={sortedVendors.map((v) => v.id)}
          strategy={verticalListSortingStrategy}
        >
          {sortedVendors.map((vendor) => (
            <SortableVendorItem
              key={vendor.id}
              vendor={vendor}
              isEditing={editingId === vendor.id}
              onEdit={() => setEditingId(vendor.id)}
              onUpdate={(updates) => handleUpdate(vendor.id, updates)}
              onDelete={() => onDelete(vendor.id)}
            />
          ))}
        </SortableContext>
      </div>

      {/* 拖拽预览 */}
      <DragOverlay>
        {activeVendor && (
          <VendorItem
            vendor={activeVendor}
            isEditing={false}
            onEdit={() => {}}
            onUpdate={() => {}}
            onDelete={() => {}}
            draggable
          />
        )}
      </DragOverlay>
    </DndContext>
  )
}

// 使用 React.memo 优化性能
export default React.memo(VendorList)
