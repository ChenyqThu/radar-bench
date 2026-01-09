import { useEffect, useState } from 'react'
import { ThemeProvider } from 'next-themes'
import { useTranslation } from 'react-i18next'
import { AppLayout } from '@/components/layout/AppLayout'
import { useRadarStore } from '@/store'
import { RadarChart } from '@/components/charts/RadarChart'
import { InlineSubRadarChart } from '@/components/charts/InlineSubRadarChart'
import { RadarTabBar } from '@/components/radar/RadarTabBar'
import { VendorManager } from '@/components/vendors/VendorManager'
import { DimensionTable } from '@/components/dimensions/DimensionTable'
import { ScoreBoard } from '@/components/scoreboard/ScoreBoard'
import { Separator } from '@/components/ui/separator'
import { FullScreenLoading } from '@/components/ui/skeleton'
import { ErrorBoundary } from '@/components/ErrorBoundary'

function App() {
  const { t } = useTranslation()
  const { loadFromStorage, isLoading, getActiveChart } = useRadarStore()

  // 当前选中的维度用于显示子维度雷达图
  const [selectedDimensionId, setSelectedDimensionId] = useState<string | null>(
    null
  )

  // 获取当前选中的维度
  const activeChart = getActiveChart()
  const selectedDimension = selectedDimensionId
    ? activeChart?.dimensions.find((d) => d.id === selectedDimensionId)
    : null

  // 处理维度点击事件
  const handleDimensionClick = (dimensionId: string) => {
    setSelectedDimensionId(dimensionId)
  }

  // 应用启动时加载数据
  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  if (isLoading) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AppLayout>
          <FullScreenLoading message={t('common.loading')} />
        </AppLayout>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppLayout>
        <ErrorBoundary>
          <div className="flex h-[calc(100vh-4rem)] flex-col">
            {/* 雷达图 Tab 导航栏 */}
            <div className="flex-shrink-0 px-6 pt-4">
              <RadarTabBar />
            </div>

            <Separator />

            {/* 主要内容区域 */}
            <div className="flex-1 overflow-y-auto">
              <div className="container mx-auto p-6">
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
                  {/* 左侧：双雷达图区域（并排显示） */}
                  <div className="xl:col-span-3">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {/* 主雷达图 */}
                      <ErrorBoundary>
                        <div className="flex flex-col">
                          <div className="mb-2">
                            <h3 className="text-sm font-semibold text-muted-foreground">
                              主雷达图
                            </h3>
                          </div>
                          <RadarChart
                            height={550}
                            onDimensionClick={handleDimensionClick}
                          />
                        </div>
                      </ErrorBoundary>

                      {/* 子维度雷达图 */}
                      <ErrorBoundary>
                        <div className="flex flex-col">
                          <div className="mb-2">
                            <h3 className="text-sm font-semibold text-muted-foreground">
                              子维度雷达图
                            </h3>
                          </div>
                          {selectedDimension ? (
                            <InlineSubRadarChart
                              dimension={selectedDimension}
                              vendors={activeChart?.vendors || []}
                              height={550}
                              onClose={() => setSelectedDimensionId(null)}
                            />
                          ) : (
                            <div className="flex h-[550px] items-center justify-center rounded-lg border-2 border-dashed border-muted bg-muted/10">
                              <div className="text-center text-muted-foreground">
                                <p className="text-sm">点击主雷达图的维度</p>
                                <p className="text-sm">查看子维度对比</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </ErrorBoundary>
                    </div>
                  </div>

                  {/* 右侧：竞品管理和排名 */}
                  <div className="space-y-6">
                    <ErrorBoundary>
                      <VendorManager />
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <ScoreBoard />
                    </ErrorBoundary>
                  </div>
                </div>

                {/* 底部：维度管理表格 */}
                <div className="mt-6">
                  <ErrorBoundary>
                    <DimensionTable onViewSubRadar={handleDimensionClick} />
                  </ErrorBoundary>
                </div>
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </AppLayout>
    </ThemeProvider>
  )
}

export default App
