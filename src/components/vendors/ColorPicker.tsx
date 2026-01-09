/**
 * 颜色选择器组件
 * 使用 react-colorful 实现
 */

import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface ColorPickerProps {
  /** 当前颜色值（hex 格式） */
  color: string
  /** 颜色变化回调 */
  onChange: (color: string) => void
  /** 标签 */
  label?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义类名 */
  className?: string
}

/**
 * 颜色选择器组件
 */
export function ColorPicker({
  color,
  onChange,
  label,
  disabled = false,
  className,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(color)

  const handleColorChange = (newColor: string) => {
    setInputValue(newColor)
    onChange(newColor)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    // 验证是否为有效的 hex 颜色
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      onChange(value)
    }
  }

  const handleInputBlur = () => {
    // 如果输入无效，恢复为当前颜色
    if (!/^#[0-9A-Fa-f]{6}$/.test(inputValue)) {
      setInputValue(color)
    }
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {label && (
        <Label htmlFor="color-input" className="text-sm font-medium">
          {label}
        </Label>
      )}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              'h-10 w-10 rounded-md border-2 transition-all',
              'hover:scale-110 hover:shadow-md',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              disabled
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            )}
            style={{ backgroundColor: color }}
            aria-label="选择颜色"
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <div className="space-y-3">
            <HexColorPicker color={color} onChange={handleColorChange} />
            <div className="flex items-center gap-2">
              <Input
                id="color-input"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className="font-mono text-sm"
                placeholder="#000000"
                maxLength={7}
              />
            </div>
            <div className="flex gap-2">
              {/* 预设颜色 */}
              <div className="grid grid-cols-6 gap-1.5">
                {PRESET_COLORS.map((presetColor) => (
                  <button
                    key={presetColor}
                    type="button"
                    className={cn(
                      'h-6 w-6 rounded border-2 transition-all hover:scale-110',
                      presetColor === color
                        ? 'border-blue-500'
                        : 'border-gray-300 dark:border-gray-600'
                    )}
                    style={{ backgroundColor: presetColor }}
                    onClick={() => handleColorChange(presetColor)}
                    aria-label={`选择颜色 ${presetColor}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <span className="font-mono text-sm text-muted-foreground">
        {color.toUpperCase()}
      </span>
    </div>
  )
}

/**
 * 预设颜色
 */
const PRESET_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
  '#84CC16', // lime
  '#6366F1', // indigo
  '#14B8A6', // teal
  '#F43F5E', // rose
]
