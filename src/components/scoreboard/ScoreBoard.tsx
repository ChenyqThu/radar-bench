/**
 * 总分展示面板
 * 显示竞品的加权总分和实时排名
 */

import React, { useMemo } from 'react'
import { useRadarStore } from '@/store/radarStore'
import { Card } from '@/components/ui/card'
import { RankingList } from './RankingList'
import { getRankings } from '@/lib/calculations'
import { useTranslation } from 'react-i18next'

/**
 * 总分展示面板
 */
export function ScoreBoard() {
  const { t } = useTranslation()
  const { getActiveChart } = useRadarStore()
  const activeChart = getActiveChart()

  const rankings = useMemo(() => {
    if (!activeChart) return []
    return getRankings(activeChart.dimensions, activeChart.vendors)
  }, [activeChart])

  if (!activeChart) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">{t('scoreBoard.noActiveChart')}</p>
      </Card>
    )
  }

  if (activeChart.vendors.length === 0 || activeChart.dimensions.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">{t('scoreBoard.noData')}</p>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{t('scoreBoard.title')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('scoreBoard.description')}
        </p>
      </div>
      <RankingList rankings={rankings} />
    </Card>
  )
}

// 使用 React.memo 优化性能
export default React.memo(ScoreBoard)
