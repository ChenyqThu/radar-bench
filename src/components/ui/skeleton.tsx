import { cn } from '@/lib/utils'

/**
 * 骨架屏组件 Props
 */
export interface SkeletonProps {
  className?: string
}

/**
 * 基础骨架屏组件
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-800',
        className
      )}
    />
  )
}

/**
 * 雷达图骨架屏
 */
export function RadarChartSkeleton({ height = 600 }: { height?: number }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950"
      style={{ height }}
    >
      {/* 标题骨架 */}
      <Skeleton className="mb-6 h-6 w-48" />

      {/* 雷达图骨架 */}
      <div className="relative flex h-full w-full items-center justify-center">
        <Skeleton className="h-[400px] w-[400px] rounded-full" />
      </div>

      {/* 图例骨架 */}
      <div className="mt-6 flex gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}

/**
 * 表格骨架屏
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {/* 表头 */}
      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* 表格行 */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 w-20" />
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-32" />
        </div>
      ))}
    </div>
  )
}

/**
 * 卡片列表骨架屏
 */
export function CardListSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950"
        >
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  )
}

/**
 * 排名列表骨架屏
 */
export function RankingListSkeleton({ items = 4 }: { items?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-950"
        >
          <Skeleton className="h-6 w-6 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-5 w-12" />
        </div>
      ))}
    </div>
  )
}

/**
 * 通用加载指示器（Spinner）
 */
export function LoadingSpinner({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
  }

  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-solid border-blue-600 border-r-transparent',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="加载中"
    />
  )
}

/**
 * 全屏加载组件
 */
export function FullScreenLoading({
  message = '加载中...',
}: {
  message?: string
}) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  )
}
