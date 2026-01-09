import React, { useMemo } from 'react'
import { useRadarStore } from '@/store/radarStore'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export const ScoreEditor: React.FC = () => {
  const { getActiveChart, updateDimensionScore } = useRadarStore()
  const activeChart = getActiveChart()

  // 按 order 排序维度和竞品
  const sortedDimensions = useMemo(() => {
    if (!activeChart) return []
    return [...activeChart.dimensions].sort((a, b) => a.order - b.order)
  }, [activeChart])

  const sortedVendors = useMemo(() => {
    if (!activeChart) return []
    return [...activeChart.vendors].sort((a, b) => a.order - b.order)
  }, [activeChart])

  if (!activeChart) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          请先创建雷达图
        </CardContent>
      </Card>
    )
  }

  if (sortedVendors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>分数编辑</CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center text-gray-500">
          请先添加竞品
        </CardContent>
      </Card>
    )
  }

  if (sortedDimensions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>分数编辑</CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center text-gray-500">
          请先添加维度
        </CardContent>
      </Card>
    )
  }

  const handleScoreChange = (
    dimensionId: string,
    vendorId: string,
    value: string
  ) => {
    const score = parseInt(value)
    if (isNaN(score)) {
      updateDimensionScore(activeChart.id, dimensionId, vendorId, 0)
      return
    }

    // 限制分数范围 0-10
    const clampedScore = Math.max(0, Math.min(10, score))
    updateDimensionScore(activeChart.id, dimensionId, vendorId, clampedScore)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>分数编辑</CardTitle>
        <p className="text-sm text-gray-500">分数范围: 0-10</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-4 py-3 text-left font-medium">维度</th>
                {sortedVendors.map((vendor) => (
                  <th
                    key={vendor.id}
                    className="px-4 py-3 text-center font-medium"
                    style={{ color: vendor.color }}
                  >
                    {vendor.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedDimensions.map((dimension, index) => (
                <tr
                  key={dimension.id}
                  className={cn(
                    'border-b border-gray-100 dark:border-gray-900',
                    index % 2 === 0
                      ? 'bg-gray-50 dark:bg-gray-900/30'
                      : 'bg-white dark:bg-transparent'
                  )}
                >
                  <td className="px-4 py-3 font-medium">
                    <div>
                      {dimension.name}
                      <span className="ml-2 text-xs text-gray-500">
                        ({dimension.weight}%)
                      </span>
                    </div>
                  </td>
                  {sortedVendors.map((vendor) => (
                    <td key={vendor.id} className="px-4 py-2">
                      <Input
                        type="number"
                        min={0}
                        max={10}
                        value={dimension.scores[vendor.id] ?? 0}
                        onChange={(e) =>
                          handleScoreChange(
                            dimension.id,
                            vendor.id,
                            e.target.value
                          )
                        }
                        className="w-20 text-center"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 总分显示 */}
        <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-800">
          <h4 className="mb-3 font-medium">加权总分</h4>
          <div className="flex gap-4">
            {sortedVendors.map((vendor) => {
              const totalScore = sortedDimensions.reduce((sum, dimension) => {
                const score = dimension.scores[vendor.id] ?? 0
                const weightedScore = (score * dimension.weight) / 100
                return sum + weightedScore
              }, 0)

              return (
                <div
                  key={vendor.id}
                  className="rounded-lg border border-gray-200 p-3 dark:border-gray-800"
                >
                  <div
                    className="mb-1 text-sm font-medium"
                    style={{ color: vendor.color }}
                  >
                    {vendor.name}
                  </div>
                  <div className="text-2xl font-bold">
                    {totalScore.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">/ 10.00</div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ScoreEditor
