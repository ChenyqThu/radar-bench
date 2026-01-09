import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useRadarStore } from '@/store/radarStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export const DimensionEditor: React.FC = () => {
  const { getActiveChart, addDimension, updateDimension, deleteDimension } =
    useRadarStore()
  const activeChart = getActiveChart()

  const [newDimensionName, setNewDimensionName] = useState('')

  if (!activeChart) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          请先创建雷达图
        </CardContent>
      </Card>
    )
  }

  const handleAddDimension = () => {
    if (!newDimensionName.trim()) return

    const dimensionCount = activeChart.dimensions.length
    // 平均分配权重
    const weight = dimensionCount === 0 ? 100 : 0

    addDimension(activeChart.id, {
      name: newDimensionName.trim(),
      description: '',
      weight,
      order: dimensionCount,
      scores: {},
    })

    // 如果已有维度，重新平均分配权重
    if (dimensionCount > 0) {
      const newWeight = Math.floor(100 / (dimensionCount + 1))
      const remainder = 100 - newWeight * (dimensionCount + 1)

      activeChart.dimensions.forEach((dim, index) => {
        updateDimension(activeChart.id, dim.id, {
          weight: index === 0 ? newWeight + remainder : newWeight,
        })
      })
    }

    setNewDimensionName('')
  }

  const handleDeleteDimension = (dimensionId: string) => {
    if (
      window.confirm('确定要删除这个维度吗？相关的所有分数数据也将被删除。')
    ) {
      deleteDimension(activeChart.id, dimensionId)

      // 重新分配剩余维度的权重
      const remainingCount = activeChart.dimensions.length - 1
      if (remainingCount > 0) {
        const newWeight = Math.floor(100 / remainingCount)
        const remainder = 100 - newWeight * remainingCount

        activeChart.dimensions
          .filter((d) => d.id !== dimensionId)
          .forEach((dim, index) => {
            updateDimension(activeChart.id, dim.id, {
              weight: index === 0 ? newWeight + remainder : newWeight,
            })
          })
      }
    }
  }

  const handleNameChange = (dimensionId: string, name: string) => {
    updateDimension(activeChart.id, dimensionId, { name })
  }

  const handleWeightChange = (dimensionId: string, weight: number) => {
    updateDimension(activeChart.id, dimensionId, { weight })
  }

  // 计算权重总和
  const totalWeight = activeChart.dimensions.reduce(
    (sum, dim) => sum + dim.weight,
    0
  )
  const isWeightValid = totalWeight === 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>维度管理</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 权重总和提示 */}
        {activeChart.dimensions.length > 0 && (
          <div
            className={`rounded-lg p-3 text-sm ${
              isWeightValid
                ? 'bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200'
                : 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200'
            }`}
          >
            权重总和: {totalWeight}% {isWeightValid ? '✓' : '（必须等于 100%）'}
          </div>
        )}

        {/* 现有维度列表 */}
        <div className="space-y-2">
          {activeChart.dimensions.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-500">
              暂无维度，请添加
            </p>
          ) : (
            [...activeChart.dimensions]
              .sort((a, b) => a.order - b.order)
              .map((dimension) => (
                <div
                  key={dimension.id}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 p-3 dark:border-gray-800"
                >
                  {/* 名称输入 */}
                  <div className="flex-1">
                    <Input
                      value={dimension.name}
                      onChange={(e) =>
                        handleNameChange(dimension.id, e.target.value)
                      }
                      placeholder="维度名称"
                    />
                  </div>

                  {/* 权重输入 */}
                  <div className="flex w-24 items-center gap-1">
                    <Input
                      type="number"
                      value={dimension.weight}
                      onChange={(e) =>
                        handleWeightChange(
                          dimension.id,
                          parseInt(e.target.value) || 0
                        )
                      }
                      min={0}
                      max={100}
                      className="w-full"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>

                  {/* 删除按钮 */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteDimension(dimension.id)}
                    className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
          )}
        </div>

        {/* 添加新维度 */}
        <div className="flex gap-2 border-t pt-4 dark:border-gray-800">
          <Input
            value={newDimensionName}
            onChange={(e) => setNewDimensionName(e.target.value)}
            placeholder="新维度名称"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddDimension()
              }
            }}
          />
          <Button
            onClick={handleAddDimension}
            disabled={!newDimensionName.trim()}
          >
            <Plus className="h-4 w-4" />
            添加
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default DimensionEditor
