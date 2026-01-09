/**
 * 排名列表组件
 * 显示竞品的排名、分数、颜色标识
 */

import type { RankingItem } from '@/lib/calculations'
import { Badge } from '@/components/ui/badge'
import { Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface RankingListProps {
  /** 排名数据 */
  rankings: RankingItem[]
}

/**
 * 排名列表组件
 */
export function RankingList({ rankings }: RankingListProps) {
  return (
    <div className="space-y-2">
      {rankings.map(({ vendor, score, rank }) => (
        <div
          key={vendor.id}
          className={cn(
            'flex items-center justify-between rounded-lg p-3 transition-all',
            rank === 1
              ? 'bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900'
              : 'bg-muted/50'
          )}
        >
          <div className="flex items-center gap-3">
            {/* 排名徽章 */}
            {rank === 1 ? (
              <div className="flex h-8 w-8 items-center justify-center">
                <Trophy className="h-5 w-5 text-amber-500" />
              </div>
            ) : (
              <Badge
                variant={rank <= 3 ? 'default' : 'secondary'}
                className={cn(
                  'h-8 w-8 justify-center rounded-full',
                  rank === 2 && 'bg-slate-400 dark:bg-slate-600',
                  rank === 3 && 'bg-orange-400 dark:bg-orange-600'
                )}
              >
                #{rank}
              </Badge>
            )}

            {/* 竞品颜色和名称 */}
            <div
              className="h-4 w-4 flex-shrink-0 rounded-full border-2 border-white dark:border-gray-800"
              style={{ backgroundColor: vendor.color }}
            />
            <span
              className={cn(
                'font-medium',
                rank === 1 && 'text-lg text-amber-700 dark:text-amber-300'
              )}
            >
              {vendor.name}
            </span>
          </div>

          {/* 分数 */}
          <div
            className={cn(
              'text-right',
              rank === 1
                ? 'text-2xl font-bold text-amber-700 dark:text-amber-300'
                : 'text-xl font-semibold text-foreground'
            )}
          >
            {score.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )
}
