import { createContext, useContext, type ReactNode } from 'react'

export type AdminLanguage = 'en' | 'ta'

const AdminLanguageContext = createContext<AdminLanguage>('en')

export function AdminLanguageProvider({
  children,
  language,
}: {
  children: ReactNode
  language: AdminLanguage
}) {
  return <AdminLanguageContext.Provider value={language}>{children}</AdminLanguageContext.Provider>
}

export function useAdminLanguage() {
  return useContext(AdminLanguageContext)
}
