/**
 * 创建新雷达图对话框
 */

import { useState } from 'react'
import { useRadarStore } from '@/store/radarStore'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export interface CreateRadarDialogProps {
  /** 触发按钮内容 */
  trigger?: React.ReactNode
  /** 创建成功回调 */
  onSuccess?: (id: string) => void
}

/**
 * 创建新雷达图对话框
 */
export function CreateRadarDialog({
  trigger,
  onSuccess,
}: CreateRadarDialogProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { addRadarChart, setActiveChart } = useRadarStore()

  const handleCreate = async () => {
    if (!name.trim()) {
      return
    }

    setIsLoading(true)
    try {
      const id = addRadarChart({ name: name.trim() })
      // 自动激活新创建的雷达图
      setActiveChart(id)
      setOpen(false)
      setName('')
      onSuccess?.(id)
    } catch (error) {
      console.error('Failed to create radar chart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim()) {
      handleCreate()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            {t('radar.create')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('radar.createTitle')}</DialogTitle>
          <DialogDescription>{t('radar.createDescription')}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t('radar.name')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('radar.namePlaceholder')}
              autoFocus
              maxLength={100}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            onClick={handleCreate}
            disabled={!name.trim() || isLoading}
          >
            {isLoading ? t('common.creating') : t('common.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
