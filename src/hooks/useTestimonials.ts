'use client'

import { useLanguage } from '@/context/LanguageContext'
import type { ProgramId } from '@/config/site.config'
import {
  localizeTestimonial,
  testimonialsForAboutPage,
  testimonialsForProgram,
  type LocalizedTestimonial,
} from '@/config/testimonials'

/** Verified testimonials for one program, in the current site language. */
export function useProgramTestimonials(program: ProgramId): LocalizedTestimonial[] {
  const { lang } = useLanguage()
  return testimonialsForProgram(program).map((item) => localizeTestimonial(item, lang))
}

/** Verified testimonials across programs — About page only. */
export function useAboutTestimonials(): LocalizedTestimonial[] {
  const { lang } = useLanguage()
  return testimonialsForAboutPage().map((item) => localizeTestimonial(item, lang))
}
