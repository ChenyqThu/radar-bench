/**
 * 分数输入单元格组件
 * 支持内联编辑、防抖更新、验证
 */

/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { isScoreValid } from '@/lib/validators'

export interface ScoreInputCellProps {
  /** 当前分数值 (0-10) */
  value: number
  /** 分数变化回调（防抖后触发） */
  onChange: (score: number) => void
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读（显示"自动计算"） */
  readOnly?: boolean
  /** 自定义类名 */
  className?: string
}

/**
 * 分数输入单元格组件
 */
export function ScoreInputCell({
  value,
  onChange,
  disabled = false,
  readOnly = false,
  className,
}: ScoreInputCellProps) {
  const [inputValue, setInputValue] = useState(String(value))
  const [isValid, setIsValid] = useState(true)
  const [isFocused, setIsFocused] = useState(false)

  // 当外部 value 变化且不在焦点时，同步 inputValue
  useEffect(() => {
    if (!isFocused && String(value) !== inputValue) {
      setInputValue(String(value))
      setIsValid(true)
    }
  }, [value, isFocused, inputValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    // 验证输入
    const numValue = parseInt(newValue, 10)
    if (newValue === '' || isNaN(numValue)) {
      setIsValid(false)
      return
    }

    if (isScoreValid(numValue)) {
      setIsValid(true)
    } else {
      setIsValid(false)
    }
  }

  const handleBlur = () => {
    setIsFocused(false)

    const numValue = parseInt(inputValue, 10)
    if (!isNaN(numValue) && isScoreValid(numValue)) {
      // 只有当值有效且与原值不同时才触发更新
      if (numValue !== value) {
        onChange(numValue)
      }
    } else {
      // 恢复为原值
      setInputValue(String(value))
      setIsValid(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    } else if (e.key === 'Escape') {
      setInputValue(String(value))
      setIsValid(true)
      e.currentTarget.blur()
    }
  }

  if (readOnly) {
    return (
      <div
        className={cn(
          'flex h-9 items-center justify-center rounded-md bg-blue-50 dark:bg-blue-950 px-3 text-sm font-medium',
          'text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
          className
        )}
        title="自动计算"
      >
        {value.toFixed(1)}
      </div>
    )
  }

  return (
    <Input
      data-testid="score-input"
      type="number"
      min="0"
      max="10"
      step="1"
      value={inputValue}
      onChange={handleChange}
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={cn(
        'h-9 text-center',
        !isValid && 'border-destructive focus-visible:ring-destructive',
        className
      )}
      aria-label="分数输入"
      aria-invalid={!isValid}
    />
  )
}

// 使用 React.memo 优化性能
export default React.memo(ScoreInputCell)
