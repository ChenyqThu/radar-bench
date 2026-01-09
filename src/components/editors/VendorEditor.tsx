import React, { useState } from 'react'
import { Plus, Trash2, Palette } from 'lucide-react'
import { useRadarStore } from '@/store/radarStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { SymbolType } from '@/types'

const VENDOR_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
]

const VENDOR_SYMBOLS: SymbolType[] = ['circle', 'rect', 'triangle', 'diamond']

export const VendorEditor: React.FC = () => {
  const { getActiveChart, addVendor, updateVendor, deleteVendor } =
    useRadarStore()
  const activeChart = getActiveChart()

  const [newVendorName, setNewVendorName] = useState('')

  if (!activeChart) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          请先创建雷达图
        </CardContent>
      </Card>
    )
  }

  const handleAddVendor = () => {
    if (!newVendorName.trim()) return

    const vendorCount = activeChart.vendors.length
    const color = VENDOR_COLORS[vendorCount % VENDOR_COLORS.length]
    const symbol = VENDOR_SYMBOLS[vendorCount % VENDOR_SYMBOLS.length]

    addVendor(activeChart.id, {
      name: newVendorName.trim(),
      color,
      symbol,
      order: vendorCount,
    })

    setNewVendorName('')
  }

  const handleDeleteVendor = (vendorId: string) => {
    if (
      window.confirm('确定要删除这个竞品吗？相关的所有分数数据也将被删除。')
    ) {
      deleteVendor(activeChart.id, vendorId)
    }
  }

  const handleColorChange = (vendorId: string, color: string) => {
    updateVendor(activeChart.id, vendorId, { color })
  }

  const handleNameChange = (vendorId: string, name: string) => {
    updateVendor(activeChart.id, vendorId, { name })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>竞品管理</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 现有竞品列表 */}
        <div className="space-y-2">
          {activeChart.vendors.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-500">
              暂无竞品，请添加
            </p>
          ) : (
            [...activeChart.vendors]
              .sort((a, b) => a.order - b.order)
              .map((vendor) => (
                <div
                  key={vendor.id}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 p-3 dark:border-gray-800"
                >
                  {/* 颜色选择器 */}
                  <div className="relative">
                    <input
                      type="color"
                      value={vendor.color}
                      onChange={(e) =>
                        handleColorChange(vendor.id, e.target.value)
                      }
                      className="h-8 w-8 cursor-pointer rounded border-none"
                      title="选择颜色"
                    />
                    <Palette className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-white mix-blend-difference" />
                  </div>

                  {/* 名称输入 */}
                  <Input
                    value={vendor.name}
                    onChange={(e) =>
                      handleNameChange(vendor.id, e.target.value)
                    }
                    className="flex-1"
                    placeholder="竞品名称"
                  />

                  {/* 删除按钮 */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteVendor(vendor.id)}
                    className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
          )}
        </div>

        {/* 添加新竞品 */}
        <div className="flex gap-2 border-t pt-4 dark:border-gray-800">
          <Input
            value={newVendorName}
            onChange={(e) => setNewVendorName(e.target.value)}
            placeholder="新竞品名称"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddVendor()
              }
            }}
          />
          <Button onClick={handleAddVendor} disabled={!newVendorName.trim()}>
            <Plus className="h-4 w-4" />
            添加
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default VendorEditor
