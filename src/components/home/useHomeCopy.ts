'use client'

import { useLanguage } from '@/context/LanguageContext'
import { homeCopy, type HomeCopy } from '@/lib/homeCopy'

export function useHomeCopy(): HomeCopy {
  const { lang } = useLanguage()
  return homeCopy[lang]
}
