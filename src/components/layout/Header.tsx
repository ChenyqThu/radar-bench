import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'

export function Header() {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-foreground">
            {t('header.title')}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}
