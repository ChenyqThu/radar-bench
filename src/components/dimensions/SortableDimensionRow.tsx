/**
 * 可排序的维度行包装器
 * 为 DimensionRow 添加拖拽功能
 */

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Dimension, Vendor } from '@/types'
import { DimensionRow, DimensionRowProps } from './DimensionRow'

export interface SortableDimensionRowProps extends DimensionRowProps {
  dimension: Dimension
  vendors: Vendor[]
}

/**
 * 可排序的维度行包装器
 */
export function SortableDimensionRow(props: SortableDimensionRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.dimension.id })

  // 在拖拽时应用样式
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  // 将拖拽属性和监听器附加到组件的 wrapper
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <DimensionRow {...props} draggable />
    </div>
  )
}
