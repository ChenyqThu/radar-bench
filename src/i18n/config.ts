import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import translation files
import enCommon from '../../public/locales/en/common.json'
import zhCommon from '../../public/locales/zh/common.json'

const resources = {
  en: {
    common: enCommon,
  },
  zh: {
    common: zhCommon,
  },
}

// Detect browser language
const getBrowserLanguage = (): string => {
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('zh')) {
    return 'zh'
  }
  return 'en'
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getBrowserLanguage(),
    fallbackLng: 'zh',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  })
  .catch((error) => {
    console.error('i18n initialization failed:', error)
  })

export default i18n
