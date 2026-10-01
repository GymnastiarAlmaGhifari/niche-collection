import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIStore {
  viewMode: 'grid' | 'list'
  toggleViewMode: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchNumber: string
  setSearchNumber: (query: string) => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      viewMode: 'grid',
      toggleViewMode: () =>
        set((state) => ({ viewMode: state.viewMode === 'grid' ? 'list' : 'grid' })),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      searchNumber: '',
      setSearchNumber: (query) => set({ searchNumber: query }),
    }),
    {
      name: 'kurasiniche:ui-store',
      partialize: (state) => ({ viewMode: state.viewMode }),
    }
  )
)
