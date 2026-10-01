import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LangStore {
  lang: 'id' | 'en'
  toggleLang: () => void
}

export const useLangStore = create<LangStore>()(
  persist(
    (set) => ({
      lang: 'id',
      toggleLang: () => set((state) => ({ lang: state.lang === 'id' ? 'en' : 'id' })),
    }),
    {
      name: 'nichecollection:lang-store',
    }
  )
)
