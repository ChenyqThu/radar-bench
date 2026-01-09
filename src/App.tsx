import { ThemeProvider } from 'next-themes'
import { useTranslation } from 'react-i18next'
import { AppLayout } from '@/components/layout/AppLayout'

function App() {
  const { t } = useTranslation()

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
              <p className="text-muted-foreground">
                v0.1.0 - 项目基础设施已完成
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                开始构建您的竞品对比工具...
              </p>
            </div>
          </div>
        </div>
      </AppLayout>
    </ThemeProvider>
  )
}

export default App
