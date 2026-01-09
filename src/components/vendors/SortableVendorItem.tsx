/**
 * 可排序的竞品项组件
 * 包装 VendorItem，添加拖拽功能
 */

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Vendor } from '@/types'
import { VendorItem, VendorItemProps } from './VendorItem'

export interface SortableVendorItemProps extends Omit<
  VendorItemProps,
  'draggable'
> {
  vendor: Vendor
}

/**
 * 可排序的竞品项组件
 */
export function SortableVendorItem(props: SortableVendorItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.vendor.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      tabIndex={-1}
    >
      <VendorItem {...props} draggable />
    </div>
  )
}
