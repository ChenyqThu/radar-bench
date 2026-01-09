/**
 * dnd-kit 拖拽工具函数
 * 提供可复用的拖拽逻辑
 */

import { Active, Over } from '@dnd-kit/core'

/**
 * 重新排序数组项
 */
export function reorderArray<T extends { id: string; order: number }>(
  items: T[],
  activeId: string,
  overId: string
): T[] {
  const oldIndex = items.findIndex((item) => item.id === activeId)
  const newIndex = items.findIndex((item) => item.id === overId)

  if (oldIndex === -1 || newIndex === -1) {
    return items
  }

  // 创建新数组
  const newItems = [...items]
  const [movedItem] = newItems.splice(oldIndex, 1)
  newItems.splice(newIndex, 0, movedItem)

  // 更新 order 字段
  return newItems.map((item, index) => ({
    ...item,
    order: index,
  }))
}

/**
 * 检查是否可以拖拽到目标位置
 */
export function canDrop(active: Active | null, over: Over | null): boolean {
  if (!active || !over) {
    return false
  }

  // 不能拖拽到自己
  if (active.id === over.id) {
    return false
  }

  return true
}

/**
 * 获取拖拽提示类名
 */
export function getDragOverlayClassName(isDragging: boolean): string {
  return isDragging ? 'opacity-50 cursor-grabbing' : 'cursor-grab'
}

/**
 * 获取拖拽项的样式
 */
export function getDraggableItemStyle(
  isDragging: boolean,
  isOver: boolean
): React.CSSProperties {
  return {
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    backgroundColor: isOver ? 'rgba(59, 130, 246, 0.1)' : undefined,
    transition: 'all 0.2s ease',
  }
}
