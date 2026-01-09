import { useState } from 'react'
import { ThemeProvider } from 'next-themes'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { AppLayout } from '@/components/layout/AppLayout'

function App() {
  const [count, setCount] = useState(0)
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
            <div className="flex flex-col items-center gap-4 pt-8">
              <Button onClick={() => setCount((count) => count + 1)} size="lg">
                count is {count}
              </Button>
              <div className="space-y-2 text-center">
                <p className="text-muted-foreground font-medium">
                  ✅ Phase 1-5 完成 - 项目基础设施已搭建
                </p>
                <p className="text-sm text-muted-foreground">
                  Vite + React + TypeScript + Tailwind + Shadcn + ESLint + i18n
                  + Theme + Layout
                </p>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </ThemeProvider>
  )
}

export default App
