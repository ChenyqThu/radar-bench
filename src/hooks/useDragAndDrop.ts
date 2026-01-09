/**
 * 通用拖拽 Hook
 * 封装 dnd-kit 的拖拽逻辑
 */

import { useState, useCallback } from 'react'
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { canDrop } from '@/lib/dndHelpers'

export interface UseDragAndDropOptions {
  /**
   * 拖拽结束回调
   */
  onReorder: (activeId: string, overId: string) => void
  /**
   * 拖拽开始回调（可选）
   */
  onDragStart?: (activeId: string) => void
  /**
   * 拖拽取消回调（可选）
   */
  onDragCancel?: () => void
}

export interface UseDragAndDropReturn {
  /**
   * 当前拖拽的项 ID
   */
  activeId: string | null
  /**
   * 是否正在拖拽
   */
  isDragging: boolean
  /**
   * 拖拽开始处理函数
   */
  handleDragStart: (event: DragStartEvent) => void
  /**
   * 拖拽结束处理函数
   */
  handleDragEnd: (event: DragEndEvent) => void
  /**
   * 拖拽取消处理函数
   */
  handleDragCancel: () => void
}

/**
 * 通用拖拽 Hook
 */
export function useDragAndDrop(
  options: UseDragAndDropOptions
): UseDragAndDropReturn {
  const { onReorder, onDragStart, onDragCancel } = options
  const [activeId, setActiveId] = useState<string | null>(null)

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const id = event.active.id as string
      setActiveId(id)
      onDragStart?.(id)
    },
    [onDragStart]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (canDrop(active, over)) {
        onReorder(active.id as string, over!.id as string)
      }

      setActiveId(null)
    },
    [onReorder]
  )

  const handleDragCancel = useCallback(() => {
    setActiveId(null)
    onDragCancel?.()
  }, [onDragCancel])

  return {
    activeId,
    isDragging: activeId !== null,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  }
}
