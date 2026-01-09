import { useEffect } from 'react'
import { ThemeProvider } from 'next-themes'
import { useTranslation } from 'react-i18next'
import { AppLayout } from '@/components/layout/AppLayout'
import { useRadarStore } from '@/store'
import { RadarChart } from '@/components/charts/RadarChart'
import { RadarTabBar } from '@/components/radar/RadarTabBar'
import { VendorManager } from '@/components/vendors/VendorManager'
import { DimensionTable } from '@/components/dimensions/DimensionTable'
import { ScoreBoard } from '@/components/scoreboard/ScoreBoard'
import { Separator } from '@/components/ui/separator'

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
                {t('common.loading')}
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
        <div className="flex h-[calc(100vh-4rem)] flex-col">
          {/* 雷达图 Tab 导航栏 */}
          <div className="flex-shrink-0 px-6 pt-4">
            <RadarTabBar />
          </div>

          <Separator />

          {/* 主要内容区域 */}
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* 左侧：雷达图 */}
                <div className="lg:col-span-3">
                  <RadarChart height={600} />
                </div>

                {/* 右侧：竞品管理和排名 */}
                <div className="space-y-6">
                  <VendorManager />
                  <ScoreBoard />
                </div>
              </div>

              {/* 底部：维度管理表格 */}
              <div className="mt-6">
                <DimensionTable />
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </ThemeProvider>
  )
}

export default App
