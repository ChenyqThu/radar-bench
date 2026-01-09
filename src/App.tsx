import { useEffect } from 'react'
import { ThemeProvider } from 'next-themes'
import { useTranslation } from 'react-i18next'
import { AppLayout } from '@/components/layout/AppLayout'
import { useRadarStore } from '@/store'
import { RadarChart } from '@/components/charts/RadarChart'
import { ChartToolbar } from '@/components/charts/ChartToolbar'
import { VendorEditor } from '@/components/editors/VendorEditor'
import { DimensionEditor } from '@/components/editors/DimensionEditor'
import { ScoreEditor } from '@/components/editors/ScoreEditor'

function App() {
  const { t } = useTranslation()
  const { loadFromStorage, isLoading } = useRadarStore()

  // 应用启动时加载数据
  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  if (isLoading) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AppLayout>
          <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
            <div className="text-center">
              <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                加载数据中...
              </p>
            </div>
          </div>
        </AppLayout>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppLayout>
        <div className="container mx-auto p-6">
          {/* 页面标题 */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
              {t('app.title')}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              v0.3.0 - 雷达图可视化 MVP
            </p>
          </div>

          {/* 主要内容区域 */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* 左侧：雷达图 */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                <ChartToolbar />
                <RadarChart height={600} />
              </div>
            </div>

            {/* 右侧：编辑器 */}
            <div className="space-y-6">
              <VendorEditor />
              <DimensionEditor />
            </div>
          </div>

          {/* 底部：分数编辑器 */}
          <div className="mt-6">
            <ScoreEditor />
          </div>
        </div>
      </AppLayout>
    </ThemeProvider>
  )
}

export default App
