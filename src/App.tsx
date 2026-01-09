import { useEffect } from 'react'
import { ThemeProvider } from 'next-themes'
import { useTranslation } from 'react-i18next'
import { AppLayout } from '@/components/layout/AppLayout'
import { useRadarStore } from '@/store'

function App() {
  const { t } = useTranslation()
  const { loadFromStorage, radarCharts, isLoading } = useRadarStore()

  // 应用启动时加载数据
  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppLayout>
        <div className="max-w-4xl mx-auto py-12">
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-2">
                {t('app.title')}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t('app.subtitle')}
              </p>
            </div>
            <div className="pt-8">
              <p className="text-muted-foreground">v0.2.0 - 核心数据层已完成</p>
              {isLoading ? (
                <p className="text-sm text-muted-foreground mt-2">
                  加载数据中...
                </p>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">
                  已加载 {radarCharts.length} 个雷达图
                </p>
              )}
            </div>
          </div>
        </div>
      </AppLayout>
    </ThemeProvider>
  )
}

export default App
