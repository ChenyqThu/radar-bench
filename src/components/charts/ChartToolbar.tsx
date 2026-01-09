import React, { useState } from 'react'
import { Maximize2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ChartToolbarProps {
  className?: string
  onFullscreen?: () => void
  onExport?: () => void
}

/**
 * 图表工具栏组件
 * 提供全屏、导出等功能
 */
export const ChartToolbar: React.FC<ChartToolbarProps> = ({
  className,
  onFullscreen,
  onExport,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleFullscreen = () => {
    if (onFullscreen) {
      onFullscreen()
    }

    // 切换全屏状态
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true)
      })
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false)
      })
    }
  }

  const handleExport = () => {
    if (onExport) {
      onExport()
    }
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg bg-gray-50 p-2 dark:bg-gray-900/50',
        className
      )}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={handleFullscreen}
        className="gap-2"
        title={isFullscreen ? '退出全屏' : '全屏查看'}
      >
        <Maximize2 className="h-4 w-4" />
        <span className="hidden sm:inline">
          {isFullscreen ? '退出全屏' : '全屏'}
        </span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        className="gap-2"
        title="导出图片（v0.5.0 功能）"
        disabled
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">导出</span>
      </Button>

      <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
        提示: 点击图例可显示/隐藏系列
      </div>
    </div>
  )
}

export default ChartToolbar
