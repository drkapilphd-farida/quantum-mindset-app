import { AppI18nProvider } from './client'
import { getAppLang, getAppMessages } from './server'

// Wraps an app area (dashboard, exercises, welcome) in the learner's
// language: decided on the server, so the first paint is already right.
export default async function AppI18nRoot({ children }: { children: React.ReactNode }): Promise<React.JSX.Element> {
  const lang = await getAppLang()
  return (
    <AppI18nProvider lang={lang} messages={getAppMessages(lang)}>
      {children}
    </AppI18nProvider>
  )
}
