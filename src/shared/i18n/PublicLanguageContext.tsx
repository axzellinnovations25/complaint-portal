import { createContext, useContext, type ReactNode } from 'react'

export type PublicLanguage = 'en' | 'ta'

const PublicLanguageContext = createContext<PublicLanguage>('en')

export function PublicLanguageProvider({
  children,
  language,
}: {
  children: ReactNode
  language: PublicLanguage
}) {
  return <PublicLanguageContext.Provider value={language}>{children}</PublicLanguageContext.Provider>
}

export function usePublicLanguage() {
  return useContext(PublicLanguageContext)
}
