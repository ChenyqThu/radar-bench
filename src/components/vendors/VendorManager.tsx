/**
 * 竞品系列管理器
 * 提供添加、删除、编辑竞品的功能
 */

import React, { useState } from 'react'

import { useRadarStore } from '@/store/radarStore'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { VendorList } from './VendorList'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DEFAULT_COLORS, DEFAULT_SYMBOLS } from '@/lib/constants'

/**
 * 竞品系列管理器
 */
export function VendorManager() {
  const { t } = useTranslation()
  const {
    getActiveChart,
    addVendor,
    updateVendor,
    deleteVendor,
    reorderVendors,
  } = useRadarStore()
  const activeChart = getActiveChart()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [vendorToDelete, setVendorToDelete] = useState<string | null>(null)

  if (!activeChart) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">{t('vendors.noActiveChart')}</p>
      </Card>
    )
  }

  const handleAddVendor = () => {
    const vendorCount = activeChart.vendors.length
    const colorIndex = vendorCount % DEFAULT_COLORS.length
    const symbolIndex = vendorCount % DEFAULT_SYMBOLS.length

    addVendor(activeChart.id, {
      name: t('vendors.newVendor', { number: vendorCount + 1 }),
      color: DEFAULT_COLORS[colorIndex],
      symbol: DEFAULT_SYMBOLS[symbolIndex],
      order: vendorCount,
    })
  }

  const handleUpdateVendor = (
    vendorId: string,
    updates: Partial<(typeof activeChart.vendors)[0]>
  ) => {
    updateVendor(activeChart.id, vendorId, updates)
  }

  const handleDeleteVendor = (vendorId: string) => {
    // 至少保留一个竞品
    if (activeChart.vendors.length > 1) {
      setVendorToDelete(vendorId)
      setDeleteDialogOpen(true)
    }
  }

  const confirmDelete = () => {
    if (vendorToDelete && activeChart) {
      deleteVendor(activeChart.id, vendorToDelete)
      setVendorToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleReorderVendors = (vendorIds: string[]) => {
    reorderVendors(activeChart.id, vendorIds)
  }

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t('vendors.title')}</h3>
        <Button onClick={handleAddVendor} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          {t('vendors.add')}
        </Button>
      </div>
      {activeChart.vendors.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          <p>{t('vendors.empty')}</p>
          <Button onClick={handleAddVendor} variant="outline" className="mt-4">
            {t('vendors.addFirst')}
          </Button>
        </div>
      ) : (
        <VendorList
          vendors={activeChart.vendors}
          onUpdate={handleUpdateVendor}
          onDelete={handleDeleteVendor}
          onReorder={handleReorderVendors}
        />
      )}

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('vendors.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('vendors.deleteDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive"
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

// 使用 React.memo 优化性能
export default React.memo(VendorManager)
